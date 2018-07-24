import uiReducer, { selectors } from './ui'
import {
  changeLanguage,
  clearMessage,
  showMessage,
  toggleSidebar,
} from '../actions/ui'
import defaultInitialState from '../defaultInitialState'

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
  const initialState = defaultInitialState.ui

  it('should return the initial state', () => {
    expect(uiReducer(undefined, {})).toEqual(initialState)
  })

  const message = {
    title: 'Foo',
    msg: 'Text',
    level: 'info',
  }

  const stateWithMessage = {
    message,
    sidebarVisible: false,
    language: null,
  }

  it('should handle SHOW_MESSAGE', () => {
    expect(uiReducer(initialState, showMessage(message))).toEqual(stateWithMessage)
  })

  it('should handle CLEAR_MESSAGE', () => {
    expect(uiReducer(stateWithMessage, clearMessage())).toEqual({
      message: null,
      sidebarVisible: false,
      language: null,
    })
  })

  it('should handle TOGGLE_SIDEBAR', () => {
    expect(uiReducer(initialState, toggleSidebar())).toEqual({
      message: null,
      sidebarVisible: true,
      language: null,
    })
  })

  it('should handle CHANGE_LANGUAGE', () => {
    expect(uiReducer(initialState, changeLanguage('de'))).toEqual({
      message: null,
      sidebarVisible: false,
      language: 'de',
    })
  })
})
