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

export const showMessage = (msg) => ({
  type: actionTypes.SHOW_MESSAGE,
  msg,
})

export const toggleSidebar = () => ({
  type: actionTypes.TOGGLE_SIDEBAR,
})
