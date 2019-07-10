export const actionTypes = {
  CHANGE_COURSE: 'CHANGE_COURSE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOAD_PAGE_FAILURE: 'LOAD_PAGE_FAILURE',
  LOAD_PAGE_SUCCESS: 'LOAD_PAGE_SUCCESS',
  LOAD_PAGE: 'LOAD_PAGE',
  LOAD_MANIFEST_FAILURE: 'LOAD_MANIFEST_FAILURE',
  LOAD_MANIFEST_SUCCESS: 'LOAD_MANIFEST_SUCCESS',
  LOAD_MANIFEST: 'LOAD_MANIFEST',
  LOAD_SECTION_FAILURE: 'LOAD_SECTION_FAILURE',
  LOAD_SECTION_SUCCESS: 'LOAD_SECTION_SUCCESS',
  LOAD_SECTION: 'LOAD_SECTION',
  SET_CONTENT_ROOT: 'SET_CONTENT_ROOT',
  SET_STATIC_ROOT: 'SET_STATIC_ROOT',
}

export const changeCourse = course => ({
  type: actionTypes.CHANGE_COURSE,
  course,
})

export const clearError = () => ({
  type: actionTypes.CLEAR_ERROR,
})

export const loadManifestFailure = error => ({
  type: actionTypes.LOAD_MANIFEST_FAILURE,
  error,
})

export const loadManifestSuccess = data => ({
  type: actionTypes.LOAD_MANIFEST_SUCCESS,
  data,
})

export const loadManifest = () => ({
  type: actionTypes.LOAD_MANIFEST,
})

export const loadPageFailure = error => ({
  type: actionTypes.LOAD_PAGE_FAILURE,
  error,
})

export const loadPageSuccess = data => ({
  type: actionTypes.LOAD_PAGE_SUCCESS,
  data,
})

export const loadPage = (contentId, prevLanguage = undefined) => ({
  type: actionTypes.LOAD_PAGE,
  prevLanguage,
  contentId,
})

export const loadSectionFailure = error => ({
  type: actionTypes.LOAD_SECTION_FAILURE,
  error,
})

export const loadSectionSuccess = data => ({
  type: actionTypes.LOAD_SECTION_SUCCESS,
  data,
})

export const loadSection = (contentId, prevLanguage = undefined) => ({
  type: actionTypes.LOAD_SECTION,
  prevLanguage,
  contentId,
})

export const setContentRoot = contentRoot => ({
  type: actionTypes.SET_CONTENT_ROOT,
  contentRoot,
})

export const setStaticRoot = staticRoot => ({
  type: actionTypes.SET_STATIC_ROOT,
  staticRoot,
})
