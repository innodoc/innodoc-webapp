import { closeMessage, showMessage, toggleSidebar } from './ui'

it('should dispatch CLOSE_MESSAGE action', () => {
  expect(closeMessage(6)).toEqual({ type: 'CLOSE_MESSAGE', id: 6 })
})

it('should dispatch SHOW_MESSAGE action', () => {
  expect(showMessage('error', 'testError', 'message.test')).toEqual({
    level: 'error',
    message: 'message.test',
    messageType: 'testError',
    type: 'SHOW_MESSAGE',
  })
})

it('should dispatch TOGGLE_SIDEBAR action', () => {
  expect(toggleSidebar()).toEqual({ type: 'TOGGLE_SIDEBAR' })
})
