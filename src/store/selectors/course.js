import ormSelectors from './orm'

import appSelectors from './app'

const getCourseTable = state => ormSelectors.getDB(state).Course

const getCourses = state => getCourseTable(state).items

const getCurrentCourse = state => (
  getCourseTable(state).itemsById[appSelectors.getCurrentCourseId(state)]
)

export default {
  getCourseTable,
  getCourses,
  getCurrentCourse,
}
