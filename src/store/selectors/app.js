import ormSelectors from './orm'

const getAppState = state => ormSelectors.getDB(state).App.itemsById[0]

const getCurrentCourseId = state => getAppState(state).currentCourseId

const getLanguage = state => getAppState(state).language

const getSidebarVisible = state => getAppState(state).sidebarVisible

const getMessage = state => getAppState(state).message

const getError = state => getAppState(state).error

const getContentRoot = state => getAppState(state).contentRoot

const getStaticRoot = state => getAppState(state).staticRoot

export default {
  getAppState,
  getCurrentCourseId,
  getContentRoot,
  getError,
  getLanguage,
  getMessage,
  getSidebarVisible,
  getStaticRoot,
}
