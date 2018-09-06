export const actionTypes = {
  LOAD_TOC: 'LOAD_TOC',
  LOAD_TOC_SUCCESS: 'LOAD_TOC_SUCCESS',
  LOAD_TOC_FAILURE: 'LOAD_TOC_FAILURE',
  LOAD_SECTION: 'LOAD_SECTION',
  LOAD_SECTION_SUCCESS: 'LOAD_SECTION_SUCCESS',
  LOAD_SECTION_FAILURE: 'LOAD_SECTION_FAILURE',
  SET_CONTENT_ROOT: 'SET_CONTENT_ROOT',
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

export function loadSection(sectionPath) {
  return {
    type: actionTypes.LOAD_SECTION,
    sectionPath,
  }
}

export function loadSectionSuccess(data) {
  return {
    type: actionTypes.LOAD_SECTION_SUCCESS,
    data,
  }
}

export function loadSectionFailure(error) {
  return {
    type: actionTypes.LOAD_SECTION_FAILURE,
    error,
  }
}

export function setContentRoot(contentRoot) {
  return {
    type: actionTypes.SET_CONTENT_ROOT,
    contentRoot,
  }
}
