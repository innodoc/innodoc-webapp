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

  describe('i18n', () => {
    const { i18n } = state

    test('have language', () => {
      expect(i18n.language).toBe(null)
    })
  })

  describe('ui', () => {
    const { ui } = state

    test('hidden sidebar', () => {
      expect(ui.sidebarVisible).toBe(false)
    })

    test('no message', () => {
      expect(ui.message).toBe(null)
    })
  })

  describe('content', () => {
    const { content } = state

    test('content root to be empty string', () => {
      expect(content.contentRoot).toBe('')
    })

    test('current section null', () => {
      expect(content.currentSectionPath).toBe(null)
    })

    test('data empty', () => {
      expect(content.data).toEqual({})
    })
  })

  describe('exercises', () => {
    const { exercises } = state

    test('exercises empty', () => {
      expect(exercises).toEqual({})
    })
  })

  describe('db', () => {
    const { db } = state

    test('db empty', () => {
      expect(db).toEqual({
        Section: {
          items: [],
          itemsById: {},
          meta: {},
        },
      })
    })
  })
})
