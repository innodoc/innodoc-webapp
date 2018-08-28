import selectors from './ui'

describe('uiSelectors', () => {
  const state = {
    ui: {
      sidebarVisible: true,
      message: {
        title: 'Foo',
        msg: 'Bar',
        level: 'info',
      },
    },
  }

  test('getSidebarVisible', () => {
    expect(selectors.getSidebarVisible(state)).toEqual(true)
  })

  test('getMessage', () => {
    expect(selectors.getMessage(state)).toEqual({
      title: 'Foo',
      msg: 'Bar',
      level: 'info',
    })
  })
})
