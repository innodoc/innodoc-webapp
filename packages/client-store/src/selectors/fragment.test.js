import orm from '../orm'
import fragmentSelectors from './fragment'

// Create/Mock state
const dummyState = () => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  const fragmentIds = ['some-fragment', '_footer_a', '_footer_b']
  fragmentIds.forEach((id) => {
    session.Fragment.create({
      id,
      content: { en: [{ t: 'Str', c: 'Foo' }] },
    })
  })
  return { orm: state }
}

describe('fragmentSelectors', () => {
  let state

  beforeEach(() => {
    state = dummyState()
  })

  test.each([
    ['getFooterA', fragmentSelectors.getFooterA, '_footer_a'],
    ['getFooterB', fragmentSelectors.getFooterB, '_footer_b'],
  ])('%s', (_, selector, fragmentId) => {
    expect(selector(state)).toEqual({
      id: fragmentId,
      content: { en: [{ t: 'Str', c: 'Foo' }] },
    })
  })

  describe('getFragment', () => {
    test('valid', () => {
      expect(fragmentSelectors.getFragment(state, 'some-fragment')).toEqual({
        id: 'some-fragment',
        content: { en: [{ t: 'Str', c: 'Foo' }] },
      })
    })

    test('non-existant', () => {
      expect(fragmentSelectors.getFragment(state, 'non-existant')).toBeFalsy()
    })
  })
})
