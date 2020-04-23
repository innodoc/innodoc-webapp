import orm from '../orm'

import { loadManifestSuccess } from '../actions/content'

describe('IndexTerm', () => {
  let session

  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
  })

  it('should instantiate', () => {
    session.IndexTerm.create({})
    expect(session.IndexTerm.all().count()).toEqual(1)
  })

  describe('reducer', () => {
    const manifest = {
      index_terms: {
        de: {
          'term-1': ['Term 1 (de)', [['section-0/subsection-1', 'term-1-0']]],
          'term-2': ['Term 2 (de)', [['section-1/subsection-2', 'term-2-0']]],
        },
        en: {
          'term-1': ['Term 1 (en)', [['section-0/subsection-1', 'term-1-0']]],
          'term-3': [
            'Term 3 (en)',
            [
              ['section-0/subsection-2', 'term-3-0'],
              ['section-2/subsection-0', 'term-3-0'],
            ],
          ],
        },
      },
    }

    describe('loadManifestSuccess', () => {
      test('regular', () => {
        session.IndexTerm.reducer(
          loadManifestSuccess({ content: manifest }),
          session.IndexTerm,
          session
        )
        expect(session.IndexTerm.count()).toBe(3)
        const term1 = session.IndexTerm.withId('term-1')
        expect(term1.name.de).toBe('Term 1 (de)')
        expect(term1.name.en).toBe('Term 1 (en)')
        const term2 = session.IndexTerm.withId('term-2')
        expect(term2.name.de).toBe('Term 2 (de)')
        expect(term2.name.en).toBeFalsy()
        const term3 = session.IndexTerm.withId('term-3')
        expect(term3.name.de).toBeFalsy()
        expect(term3.name.en).toBe('Term 3 (en)')

        expect(session.IndexTermLocation.count()).toBe(5)
        expect(
          session.IndexTermLocation.filter({
            language: 'de',
          }).count()
        ).toBe(2)
        expect(
          session.IndexTermLocation.filter({
            language: 'en',
          }).count()
        ).toBe(3)

        expect(
          session.IndexTermLocation.exists({
            anchorId: 'term-1-0',
            indexTermId: 'term-1',
            language: 'de',
            sectionId: 'section-0/subsection-1',
          })
        ).toBe(true)
        expect(
          session.IndexTermLocation.exists({
            anchorId: 'term-1-0',
            indexTermId: 'term-1',
            language: 'en',
            sectionId: 'section-0/subsection-1',
          })
        ).toBe(true)
        expect(
          session.IndexTermLocation.exists({
            anchorId: 'term-2-0',
            indexTermId: 'term-2',
            language: 'de',
            sectionId: 'section-1/subsection-2',
          })
        ).toBe(true)
        expect(
          session.IndexTermLocation.exists({
            anchorId: 'term-3-0',
            indexTermId: 'term-3',
            language: 'en',
            sectionId: 'section-0/subsection-2',
          })
        ).toBe(true)
        expect(
          session.IndexTermLocation.exists({
            anchorId: 'term-3-0',
            indexTermId: 'term-3',
            language: 'en',
            sectionId: 'section-2/subsection-0',
          })
        ).toBe(true)
      })

      test('missing index_terms key', () => {
        session.IndexTerm.reducer(
          loadManifestSuccess({ content: {} }),
          session.IndexTerm,
          session
        )
        expect(session.IndexTerm.count()).toBe(0)
      })
    })

    test('no-op action', () => {
      session.Section.reducer({ type: 'DOES-NOT-EXIST' }, session.Section)
    })
  })
})
