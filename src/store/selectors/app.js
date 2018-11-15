import ormSelectors from './orm'

const getAppState = state => ormSelectors.getDB(state).App.itemsById[0]

const getHomeLink = state => getAppState(state).homeLink

const getLanguage = state => getAppState(state).language

const getLanguages = state => getAppState(state).languages

const getSidebarVisible = state => getAppState(state).sidebarVisible

const getMessage = state => getAppState(state).message

const getError = state => getAppState(state).error

const getContentRoot = state => getAppState(state).contentRoot

const getTitle = state => getAppState(state).title

// Used to be getCurrentSectionId
const getCurrentSectionId = state => getAppState(state).currentSectionId

export default {
  getAppState,
  getContentRoot,
  getCurrentSectionId,
  getError,
  getHomeLink,
  getLanguage,
  getLanguages,
  getMessage,
  getSidebarVisible,
  getTitle,
}
