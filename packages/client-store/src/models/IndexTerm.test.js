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
        en: {
          'term-1': [
            'Term 1',
            [
              [
                'section-0/subsection-1',
                'term-1-0',
              ],
            ],
          ],
        },
      },
    }

    describe('loadManifestSuccess', () => {
      test('regular', () => {
        session.IndexTerm.reducer(
          loadManifestSuccess({ content: manifest }), session.IndexTerm, session
        )
        const indexTerm = session.IndexTerm.first().ref
        expect(indexTerm.id).toBe('term-1')
        expect(indexTerm.language).toBe('en')
        expect(indexTerm.name).toBe('Term 1')
        const indexTermLocation = session.IndexTermLocation.first().ref
        expect(indexTermLocation.id).toBe('section-0/subsection-1#index-term-term-1-0')
        expect(indexTermLocation.anchorId).toBe('term-1-0')
        expect(indexTermLocation.indexTermId).toBe(indexTerm.id)
        expect(indexTermLocation.sectionId).toBe('section-0/subsection-1')
      })

      test('missing index_terms key', () => {
        session.IndexTerm.reducer(loadManifestSuccess({ content: {} }), session.IndexTerm, session)
        expect(session.IndexTerm.count()).toBe(0)
      })
    })

    test('no-op action', () => {
      session.Section.reducer({ type: 'DOES-NOT-EXIST' }, session.Section)
    })
  })
})
