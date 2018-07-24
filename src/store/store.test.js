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

    test('loading flag false', () => {
      expect(content.loading).toBe(false)
    })

    test('current section null', () => {
      expect(content.currentSectionId).toBe(null)
    })

    test('sections empty', () => {
      expect(content.sections).toEqual({})
    })

    test('toc empty', () => {
      expect(content.toc).toEqual([])
    })
  })

  describe('exercises', () => {
    const { exercises } = state

    test('exercises empty', () => {
      expect(exercises).toEqual({})
    })
  })
})
