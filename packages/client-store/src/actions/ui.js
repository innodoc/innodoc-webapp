import { makeSymbolObj } from '@innodoc/client-misc/src/util'

export const actionTypes = makeSymbolObj([
  'CLOSE_MESSAGE',
  'CLOSE_MESSAGES',
  'SHOW_MESSAGE',
  'TOGGLE_SIDEBAR',
])

export const closeMessage = (id) => ({
  type: actionTypes.CLOSE_MESSAGE,
  id,
})

export const closeMessages = (messageTypes) => ({
  type: actionTypes.CLOSE_MESSAGES,
  messageTypes,
})

export const showMessage = (msg) => ({
  type: actionTypes.SHOW_MESSAGE,
  msg,
})

export const toggleSidebar = () => ({
  type: actionTypes.TOGGLE_SIDEBAR,
})
