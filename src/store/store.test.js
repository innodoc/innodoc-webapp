import configureStore from './store'

it('smoke test', () => {
  let store
  expect(() => {
    store = configureStore()
  }).not.toThrow()
  expect(store).toBeDefined()
})

describe('initial state', () => {
  const store = configureStore()
  const state = store.getState()
  const App = state.db.App.itemsById[0]

  describe('i18n', () => {
    test('have language', () => {
      expect(App.language).toBe(null)
    })
  })

  describe('ui', () => {
    test('hidden sidebar', () => {
      expect(App.sidebarVisible).toBe(false)
    })

    test('no message', () => {
      expect(App.message).toBe(null)
    })
  })

  describe('content', () => {
    test('content root to be empty string', () => {
      expect(App.contentRoot).toBe('')
    })

    test('current section null', () => {
      expect(App.currentSectionId).toBe(null)
    })
  })

  describe('exercises', () => {
    const { exercises } = state

    test('exercises empty', () => {
      expect(exercises).toEqual({})
    })
  })
})
