export const actionTypes = {
  LOAD_TOC: 'LOAD_TOC',
  LOAD_TOC_SUCCESS: 'LOAD_TOC_SUCCESS',
  LOAD_TOC_FAILURE: 'LOAD_TOC_FAILURE',
  LOAD_PAGE: 'LOAD_PAGE',
  LOAD_PAGE_SUCCESS: 'LOAD_PAGE_SUCCESS',
  LOAD_PAGE_FAILURE: 'LOAD_PAGE_FAILURE',
}

export function loadToc() {
  return {
    type: actionTypes.LOAD_TOC,
  }
}

export function loadTocSuccess(data) {
  return {
    type: actionTypes.LOAD_TOC_SUCCESS,
    data,
  }
}

export function loadTocFailure(error) {
  return {
    type: actionTypes.LOAD_TOC_FAILURE,
    error,
  }
}

export function loadPage(section) {
  return {
    type: actionTypes.LOAD_PAGE,
    section,
  }
}

export function loadPageSuccess(data) {
  return {
    type: actionTypes.LOAD_PAGE_SUCCESS,
    data,
  }
}

export function loadPageFailure(error) {
  return {
    type: actionTypes.LOAD_PAGE_FAILURE,
    error,
  }
}
