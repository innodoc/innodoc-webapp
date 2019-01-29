import orm from './orm'
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
  const session = orm.mutableSession(state)
  const app = session.App.first().ref

  describe('i18n', () => {
    test('have language', () => {
      expect(app.language).toBe(null)
    })
  })

  describe('ui', () => {
    test('hidden sidebar', () => {
      expect(app.sidebarVisible).toBe(false)
    })

    test('no message', () => {
      expect(app.message).toBe(null)
    })
  })

  describe('content', () => {
    test('content root to be empty string', () => {
      expect(app.contentRoot).toBe('')
    })

    test('current section null', () => {
      expect(app.currentSectionId).toBe(null)
    })
  })

  describe('exercises', () => {
    const { exercises } = state

    test('exercises empty', () => {
      expect(exercises).toEqual({})
    })
  })
})
