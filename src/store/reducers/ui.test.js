import uiReducer from './ui'
import { clearMessage, showMessage, toggleSidebar } from '../actions/ui'
import defaultInitialState from '../defaultInitialState'

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
