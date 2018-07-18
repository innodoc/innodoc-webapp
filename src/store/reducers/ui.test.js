import uiReducer, { selectors } from './ui'
import { clearMessage, showMessage, toggleSidebar } from '../actions/ui'

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

describe('ui reducer', () => {
  const initialState = {
    message: null,
    sidebarVisible: false,
  }

  const message = {
    title: 'Foo',
    msg: 'Text',
    level: 'info',
  }

  it('should return the initial state', () => {
    expect(uiReducer(undefined, {})).toEqual(initialState)
  })

  it('should handle SHOW_MESSAGE', () => {
    expect(uiReducer(initialState, showMessage(message))).toEqual({
      message,
      sidebarVisible: false,
    })
  })

  it('should handle CLEAR_MESSAGE', () => {
    expect(uiReducer({
      message,
      sidebarVisible: false,
    }, clearMessage())).toEqual({
      message: null,
      sidebarVisible: false,
    })
  })

  it('should handle TOGGLE_SIDEBAR', () => {
    expect(uiReducer(initialState, toggleSidebar())).toEqual({
      message: null,
      sidebarVisible: true,
    })
  })
})
