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

    test('loadManifestSuccess', () => {
      session.IndexTerm.reducer(
        loadManifestSuccess({ content: manifest }), session.IndexTerm, session
      )
      const indexTerm = session.IndexTerm.first().ref
      expect(indexTerm.indexTermId).toBe('term-1')
      expect(indexTerm.language).toBe('en')
      expect(indexTerm.name).toBe('Term 1')
      const indexTermLocation = session.IndexTermLocation.first().ref
      expect(indexTermLocation.anchorId).toBe('term-1-0')
      expect(indexTermLocation.indexTermId).toBe(indexTerm.id)
      expect(indexTermLocation.sectionId).toBe('section-0/subsection-1')
    })

    test('no-op action', () => {
      session.Section.reducer({ type: 'DOES-NOT-EXIST' }, session.Section)
    })
  })
})
