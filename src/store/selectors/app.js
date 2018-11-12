import ormSelectors from './orm'

const getAppState = state => ormSelectors.getDB(state).App.itemsById[0]

const getLanguage = state => getAppState(state).language

const getSidebarVisible = state => getAppState(state).sidebarVisible

const getMessage = state => getAppState(state).message

const getError = state => getAppState(state).error

const getContentRoot = state => getAppState(state).contentRoot

// Used to be getCurrentSectionId
const getCurrentSectionId = state => getAppState(state).currentSectionId

export default {
  getAppState,
  getLanguage,
  getSidebarVisible,
  getMessage,
  getError,
  getContentRoot,
  getCurrentSectionId,
}
