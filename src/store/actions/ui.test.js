import {
  changeLanguage,
  clearMessage,
  showMessage,
  toggleSidebar,
} from './ui'

it('should dispatch CLEAR_MESSAGE action', () => {
  expect(clearMessage()).toEqual({ type: 'CLEAR_MESSAGE' })
})

it('should dispatch SHOW_MESSAGE action', () => {
  const message = {
    title: 'Test message',
    msg: 'This is a test.',
    level: 'info',
  }
  expect(showMessage(message)).toEqual({
    type: 'SHOW_MESSAGE',
    data: message,
  })
})

it('should dispatch TOGGLE_SIDEBAR action', () => {
  expect(toggleSidebar()).toEqual({ type: 'TOGGLE_SIDEBAR' })
})

it('should dispatch CHANGE_LANGUAGE action', () => {
  expect(changeLanguage('de')).toEqual({
    type: 'CHANGE_LANGUAGE',
    lang: 'de',
  })
})
