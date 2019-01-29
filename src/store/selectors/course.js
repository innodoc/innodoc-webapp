import { createSelector } from 'redux-orm'

import orm from '../orm'
import appSelectors from '.'

const getCourses = createSelector(
  orm, appSelectors.getOrmState,
  session => session.Course.all().toRefArray()
)

// Currently we support one course at the time
const getCurrentCourse = createSelector(
  orm, appSelectors.getOrmState, appSelectors.getApp,
  (session, app) => {
    const firstCourse = session.Course.withId(app.currentCourseId)
    return firstCourse ? firstCourse.ref : null
  }
)

export default {
  getCourses,
  getCurrentCourse,
}
