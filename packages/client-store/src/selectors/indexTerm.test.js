import orm from '../orm'
import indexTermSelectors from './indexTerm'

const dummyState = () => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  session.App.create({ id: 0, language: 'en' })

  session.Section.create({ id: 'section-0/subsection-1' })
  session.Section.create({ id: 'section-0/subsection-2' })
  session.Section.create({ id: 'section-1/subsection-2' })
  session.Section.create({ id: 'section-2/subsection-0' })

  const term1 = session.IndexTerm.create({
    id: 'term-1',
    name: {
      de: 'Term 1 (de)',
      en: 'Term 1 (en)',
    },
  })
  session.IndexTermLocation.create({
    id: 'de/section-0/subsection-1#index-term-term-1-0',
    anchorId: 'term-1-0',
    indexTermId: term1.id,
    language: 'de',
    sectionId: 'section-0/subsection-1',
  })
  session.IndexTermLocation.create({
    id: 'en/section-0/subsection-1#index-term-term-1-0',
    anchorId: 'term-1-0',
    indexTermId: term1.id,
    language: 'en',
    sectionId: 'section-0/subsection-1',
  })

  const term2 = session.IndexTerm.create({
    id: 'term-2',
    name: { de: 'Term 2 (de)' },
  })
  session.IndexTermLocation.create({
    id: 'de/section-1/subsection-2#index-term-term-2-0',
    anchorId: 'term-2-0',
    indexTermId: term2.id,
    language: 'de',
    sectionId: 'section-1/subsection-2',
  })

  const term3 = session.IndexTerm.create({
    id: 'a-term-3',
    name: { en: 'A Term 3 (en)' },
  })
  session.IndexTermLocation.create({
    id: 'en/section-0/subsection-2#index-term-a-term-3-0',
    anchorId: 'a-term-3-0',
    indexTermId: term3.id,
    language: 'en',
    sectionId: 'section-0/subsection-2',
  })
  session.IndexTermLocation.create({
    id: 'en/section-2/subsection-0#index-term-a-term-3-0',
    anchorId: 'a-term-3-0',
    indexTermId: term3.id,
    language: 'en',
    sectionId: 'section-2/subsection-0',
  })
  return { orm: state }
}

describe('indexTermSelectors', () => {
  test("getIndexTerms('de')", () => {
    const state = dummyState()
    const indexTerms = indexTermSelectors.getIndexTerms(state, 'de')
    expect(indexTerms).toHaveLength(2)
    const [term1, term2] = indexTerms

    expect(term1.id).toBe('term-1')
    expect(term1.name).toBe('Term 1 (de)')
    expect(term1.locations).toHaveLength(1)
    expect(term1.locations[0].id).toEqual('de/section-0/subsection-1#index-term-term-1-0')
    expect(term1.locations[0].contentId).toEqual('section-0/subsection-1#index-term-term-1-0')

    expect(term2.id).toBe('term-2')
    expect(term2.name).toBe('Term 2 (de)')
    expect(term2.locations).toHaveLength(1)
    expect(term2.locations[0].id).toEqual('de/section-1/subsection-2#index-term-term-2-0')
    expect(term2.locations[0].contentId).toEqual('section-1/subsection-2#index-term-term-2-0')
  })

  test("getIndexTerms('en')", () => {
    const state = dummyState()
    const indexTerms = indexTermSelectors.getIndexTerms(state, 'en')
    expect(indexTerms).toHaveLength(2)
    const [term3, term1] = indexTerms

    expect(term3.id).toBe('a-term-3')
    expect(term3.name).toBe('A Term 3 (en)')
    expect(term3.locations).toHaveLength(2)
    expect(
      term3.locations.some(
        (loc) =>
          loc.id === 'en/section-0/subsection-2#index-term-a-term-3-0' &&
          loc.contentId === 'section-0/subsection-2#index-term-a-term-3-0'
      )
    ).toBe(true)
    expect(
      term3.locations.some(
        (loc) =>
          loc.id === 'en/section-2/subsection-0#index-term-a-term-3-0' &&
          loc.contentId === 'section-2/subsection-0#index-term-a-term-3-0'
      )
    ).toBe(true)

    expect(term1.id).toBe('term-1')
    expect(term1.name).toBe('Term 1 (en)')
    expect(term1.locations).toHaveLength(1)
    expect(term1.locations[0].id).toBe('en/section-0/subsection-1#index-term-term-1-0')
    expect(term1.locations[0].contentId).toBe('section-0/subsection-1#index-term-term-1-0')
  })
})
