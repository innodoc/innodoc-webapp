export const actionTypes = {
  FAILURE: 'FAILURE',
  LOAD_PAGE: 'LOAD_PAGE',
  LOAD_PAGE_SUCCESS: 'LOAD_PAGE_SUCCESS',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
}

export function toggleSidebar() {
  return {
    type: actionTypes.TOGGLE_SIDEBAR,
  }
}
