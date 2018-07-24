import uiReducer, { selectors } from './ui'
import { clearMessage, showMessage, toggleSidebar } from '../actions/ui'
import defaultInitialState from '../defaultInitialState'

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

describe('uiReducer', () => {
  const initialState = defaultInitialState.ui

  test('initialState', () => {
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
  }

  test('SHOW_MESSAGE', () => {
    expect(uiReducer(initialState, showMessage(message))).toEqual(stateWithMessage)
  })

  test('CLEAR_MESSAGE', () => {
    expect(uiReducer(stateWithMessage, clearMessage())).toEqual({
      message: null,
      sidebarVisible: false,
    })
  })

  test('TOGGLE_SIDEBAR', () => {
    expect(uiReducer(initialState, toggleSidebar())).toEqual({
      message: null,
      sidebarVisible: true,
    })
  })
})
