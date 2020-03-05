import makeActions from './makeActions'

export const actionTypes = makeActions([
  'CLOSE_MESSAGE',
  'SHOW_MESSAGE',
  'TOGGLE_SIDEBAR',
])

export const closeMessage = (id) => ({
  type: actionTypes.CLOSE_MESSAGE,
  id,
})

export const showMessage = (level, messageType, text) => ({
  type: actionTypes.SHOW_MESSAGE,
  level,
  messageType,
  text,
})

export const toggleSidebar = () => ({
  type: actionTypes.TOGGLE_SIDEBAR,
})
