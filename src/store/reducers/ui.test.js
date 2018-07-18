import { selectors } from './ui'

describe('ui selectors', () => {
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

  it('should select sidebarVisible', () => {
    expect(selectors.getSidebarVisible(state)).toEqual(true)
  })

  it('should select message', () => {
    expect(selectors.getMessage(state)).toEqual({
      title: 'Foo',
      msg: 'Bar',
      level: 'info',
    })
  })
})
