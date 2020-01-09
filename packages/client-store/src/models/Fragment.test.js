import orm from '../orm'

import { loadFragmentSuccess } from '../actions/content'

describe('Fragment', () => {
  let session

  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
  })

  it('should instantiate', () => {
    session.Fragment.create({})
    expect(session.Fragment.all().count()).toEqual(1)
  })

  describe('reducer', () => {
    const content = [{ t: 'Str', c: 'Foo' }]
    const fragmentData = {
      contentId: 'frag-1',
      content,
      language: 'en',
    }

    test('loadFragmentSuccess', () => {
      session.Fragment.reducer(
        loadFragmentSuccess(fragmentData),
        session.Fragment
      )
      const fragment = session.Fragment.first().ref
      expect(fragment.id).toBe('frag-1')
      expect(fragment.content.en).toBe(content)
    })

    test('no-op action', () => {
      session.Section.reducer({ type: 'DOES-NOT-EXIST' }, session.Section)
    })
  })
})
