export const actionTypes = {
  FAILURE: 'FAILURE',
  LOAD_PAGE: 'LOAD_PAGE',
  LOAD_PAGE_SUCCESS: 'LOAD_PAGE_SUCCESS',
}

export function failure(error) {
  return {
    type: actionTypes.FAILURE,
    error
  }
}

export function loadPage(pageSlug) {
  return {
    type: actionTypes.LOAD_PAGE,
    pageSlug,
  }
}

export function loadPageSuccess(data) {
  return {
    type: actionTypes.LOAD_PAGE_SUCCESS,
    data
  }
}
