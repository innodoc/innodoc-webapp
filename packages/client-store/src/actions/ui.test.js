import { closeMessage, showMessage, toggleSidebar } from './ui'

test('CLOSE_MESSAGE action', () => {
  expect(closeMessage(6)).toEqual({ type: 'CLOSE_MESSAGE', id: 6 })
})

test('SHOW_MESSAGE action', () => {
  const msg = {
    closable: true,
    level: 'error',
    text: 'message.test',
    type: 'testError',
  }
  expect(showMessage(msg)).toEqual({
    type: 'SHOW_MESSAGE',
    msg,
  })
})

test('TOGGLE_SIDEBAR action', () => {
  expect(toggleSidebar()).toEqual({ type: 'TOGGLE_SIDEBAR' })
})
