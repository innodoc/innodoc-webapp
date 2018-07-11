export const actionTypes = {
  CLEAR_MESSAGE: 'CLEAR_MESSAGE',
  SHOW_MESSAGE: 'SHOW_MESSAGE',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
}

export function clearMessage() {
  return {
    type: actionTypes.CLEAR_MESSAGE,
  }
}

export function showMessage(data) {
  return {
    type: actionTypes.SHOW_MESSAGE,
    data,
  }
}

export function toggleSidebar() {
  return {
    type: actionTypes.TOGGLE_SIDEBAR,
  }
}
