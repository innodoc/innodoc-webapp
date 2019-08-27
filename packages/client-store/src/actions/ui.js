export const actionTypes = {
  CLEAR_MESSAGE: 'CLEAR_MESSAGE',
  SHOW_MESSAGE: 'SHOW_MESSAGE',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
}

export const clearMessage = () => ({
  type: actionTypes.CLEAR_MESSAGE,
})

export const showMessage = (data) => ({
  type: actionTypes.SHOW_MESSAGE,
  data,
})

export const toggleSidebar = () => ({
  type: actionTypes.TOGGLE_SIDEBAR,
})
