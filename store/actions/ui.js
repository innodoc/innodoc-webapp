export const actionTypes = {
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
}

export function toggleSidebar() {
  return {
    type: actionTypes.TOGGLE_SIDEBAR,
  }
}
