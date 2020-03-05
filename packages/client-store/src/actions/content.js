import makeActions from './makeActions'

export const actionTypes = makeActions([
  'CHANGE_COURSE',
  'LOAD_FRAGMENT_FAILURE',
  'LOAD_FRAGMENT_SUCCESS',
  'LOAD_FRAGMENT',
  'LOAD_MANIFEST_FAILURE',
  'LOAD_MANIFEST_SUCCESS',
  'LOAD_MANIFEST',
  'LOAD_PAGE_FAILURE',
  'LOAD_PAGE_SUCCESS',
  'LOAD_PAGE',
  'LOAD_SECTION_FAILURE',
  'LOAD_SECTION_SUCCESS',
  'LOAD_SECTION',
  'NAVIGATE',
  'SET_SERVER_CONFIGURATION',
])

export const changeCourse = (course) => ({
  type: actionTypes.CHANGE_COURSE,
  course,
})

export const loadFragmentFailure = (error) => ({
  type: actionTypes.LOAD_FRAGMENT_FAILURE,
  error,
})

export const loadFragmentSuccess = (data) => ({
  type: actionTypes.LOAD_FRAGMENT_SUCCESS,
  data,
})

export const loadFragment = (contentId) => ({
  type: actionTypes.LOAD_FRAGMENT,
  contentId,
})

export const loadPageFailure = (error) => ({
  type: actionTypes.LOAD_PAGE_FAILURE,
  error,
})

export const loadPageSuccess = (data) => ({
  type: actionTypes.LOAD_PAGE_SUCCESS,
  data,
})

export const loadPage = (contentId, prevLanguage = undefined) => ({
  type: actionTypes.LOAD_PAGE,
  prevLanguage,
  contentId,
})

export const loadManifestFailure = (error) => ({
  type: actionTypes.LOAD_MANIFEST_FAILURE,
  error,
})

export const loadManifestSuccess = (data) => ({
  type: actionTypes.LOAD_MANIFEST_SUCCESS,
  data,
})

export const loadManifest = () => ({
  type: actionTypes.LOAD_MANIFEST,
})

export const loadSectionFailure = (error) => ({
  type: actionTypes.LOAD_SECTION_FAILURE,
  error,
})

export const loadSectionSuccess = (data) => ({
  type: actionTypes.LOAD_SECTION_SUCCESS,
  data,
})

export const loadSection = (contentId, prevLanguage = undefined) => ({
  type: actionTypes.LOAD_SECTION,
  prevLanguage,
  contentId,
})

export const navigate = () => ({
  type: actionTypes.NAVIGATE,
})

export const setServerConfiguration = (
  appRoot,
  contentRoot,
  staticRoot,
  sectionPathPrefix,
  pagePathPrefix
) => ({
  type: actionTypes.SET_SERVER_CONFIGURATION,
  config: {
    appRoot,
    contentRoot,
    staticRoot,
    sectionPathPrefix,
    pagePathPrefix,
  },
})
