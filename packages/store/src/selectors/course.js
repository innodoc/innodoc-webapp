import { createSelector } from 'redux-orm'

import orm from '../orm.js'

import { getApp } from './misc.js'

export const getCourses = createSelector(orm, (session) => session.Course.all().toRefArray())

// Currently we support one course at the time
export const getCurrentCourse = createSelector(orm, getApp, (session, app) => {
  const currentCourse = session.Course.withId(app.currentCourseId)
  return currentCourse ? currentCourse.ref : undefined
})
