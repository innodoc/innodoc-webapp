import { util } from '@innodoc/client-misc'

export const actionTypes = util.makeSymbolObj([
  'CHANGE_COURSE',
  'CONTENT_NOT_FOUND',
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
  'ROUTE_CHANGE_START',
  'SECTION_VISIT',
  'SET_SERVER_CONFIGURATION', // TODO: remove in favor of env vars
])

export const changeCourse = (course) => ({
  type: actionTypes.CHANGE_COURSE,
  course,
})

export const contentNotFound = () => ({
  type: actionTypes.CONTENT_NOT_FOUND,
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

export const loadManifest = (contentRoot) => ({
  type: actionTypes.LOAD_MANIFEST,
  contentRoot,
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

export const routeChangeStart = () => ({
  type: actionTypes.ROUTE_CHANGE_START,
})

export const sectionVisit = (sectionId) => ({
  type: actionTypes.SECTION_VISIT,
  sectionId,
})

// TODO: remove once migrated to env vars
export const setServerConfiguration = (
  appRoot,
  contentRoot,
  discourseUrl,
  ftSearch,
  staticRoot,
  csrfToken,
  sectionPathPrefix,
  pagePathPrefix,
  pdfFilename
) => ({
  type: actionTypes.SET_SERVER_CONFIGURATION,
  config: {
    appRoot,
    contentRoot,
    discourseUrl,
    ftSearchEnabled: ftSearch,
    csrfToken,
    pagePathPrefix,
    pdfFilename,
    sectionPathPrefix,
    staticRoot,
  },
})
