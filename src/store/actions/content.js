export const actionTypes = {
  LOAD_MANIFEST: 'LOAD_MANIFEST',
  LOAD_MANIFEST_SUCCESS: 'LOAD_MANIFEST_SUCCESS',
  LOAD_MANIFEST_FAILURE: 'LOAD_MANIFEST_FAILURE',
  LOAD_SECTION: 'LOAD_SECTION',
  LOAD_SECTION_SUCCESS: 'LOAD_SECTION_SUCCESS',
  LOAD_SECTION_FAILURE: 'LOAD_SECTION_FAILURE',
  SET_CONTENT_ROOT: 'SET_CONTENT_ROOT',
  SET_STATIC_ROOT: 'SET_STATIC_ROOT',
  CHANGE_COURSE: 'CHANGE_COURSE',
  CLEAR_ERROR: 'CLEAR_ERROR',
}

export function loadManifest() {
  return {
    type: actionTypes.LOAD_MANIFEST,
  }
}

export function loadManifestSuccess(data) {
  return {
    type: actionTypes.LOAD_MANIFEST_SUCCESS,
    data,
  }
}

export function loadManifestFailure(error) {
  return {
    type: actionTypes.LOAD_MANIFEST_FAILURE,
    error,
  }
}

export function loadSection(sectionId) {
  return {
    type: actionTypes.LOAD_SECTION,
    sectionId,
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

export function setStaticRoot(staticRoot) {
  return {
    type: actionTypes.SET_STATIC_ROOT,
    staticRoot,
  }
}

export function changeCourse(course) {
  return {
    type: actionTypes.CHANGE_COURSE,
    course,
  }
}

export function clearError() {
  return {
    type: actionTypes.CLEAR_ERROR,
  }
}
