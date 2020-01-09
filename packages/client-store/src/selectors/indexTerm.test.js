import orm from '../orm'
import indexTermSelectors from './indexTerm'

// Create/Mock state
const dummyState = () => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  session.App.create({ id: 0, language: 'en' })
  const termB = session.IndexTerm.create({
    id: 'term-b',
    language: 'en',
    name: 'Term B',
  })
  session.IndexTermLocation.create({
    id: 'section-0/subsection-1#index-term-term-b-0',
    anchorId: 'term-b-0',
    indexTermId: termB.id,
    sectionId: 'section-0/subsection-1',
  })
  session.IndexTermLocation.create({
    id: 'section-1#index-term-term-b-0',
    anchorId: 'term-b-0',
    indexTermId: termB.id,
    sectionId: 'section-1',
  })
  const termA = session.IndexTerm.create({
    id: 'term-a',
    language: 'en',
    name: 'Term A',
  })
  session.IndexTermLocation.create({
    id: 'section-0/subsection-1#index-term-term-a-0',
    anchorId: 'term-a-0',
    indexTermId: termA.id,
    sectionId: 'section-0/subsection-1',
  })
  const termC = session.IndexTerm.create({
    id: 'term-c',
    language: 'de',
    name: 'Term C',
  })
  session.IndexTermLocation.create({
    id: 'section-1#index-term-term-c-0',
    anchorId: 'term-c-0',
    indexTermId: termC.id,
    sectionId: 'section-1',
  })
  return { orm: state }
}

describe('indexTermSelectors', () => {
  test('getIndexTerms', () => {
    const state = dummyState()
    const indexTerms = indexTermSelectors.getIndexTerms(state, 'en')
    const [termA, termB] = indexTerms
    expect(indexTerms).toHaveLength(2)
    expect(termA.id).toBe('term-a')
    expect(termA.language).toBe('en')
    expect(termA.locations).toEqual([
      'section-0/subsection-1#index-term-term-a-0',
    ])
    expect(termA.name).toBe('Term A')
    expect(termB.id).toBe('term-b')
    expect(termB.language).toBe('en')
    expect(termB.locations).toEqual([
      'section-0/subsection-1#index-term-term-b-0',
      'section-1#index-term-term-b-0',
    ])
    expect(termB.name).toBe('Term B')
  })
})
