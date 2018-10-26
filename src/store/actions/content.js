export const actionTypes = {
  LOAD_MANIFEST: 'LOAD_MANIFEST',
  LOAD_MANIFEST_SUCCESS: 'LOAD_MANIFEST_SUCCESS',
  LOAD_MANIFEST_FAILURE: 'LOAD_MANIFEST_FAILURE',
  LOAD_SECTION: 'LOAD_SECTION',
  LOAD_SECTION_SUCCESS: 'LOAD_SECTION_SUCCESS',
  LOAD_SECTION_FAILURE: 'LOAD_SECTION_FAILURE',
  SET_CONTENT_ROOT: 'SET_CONTENT_ROOT',
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
