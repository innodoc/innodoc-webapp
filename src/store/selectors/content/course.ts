import { createSelector } from '@reduxjs/toolkit'

import type { RootState } from '#store/makeStore'
import { selectCourseName } from '#store/selectors/ui'
import contentApi from '#store/slices/contentApi'
import type { ApiCourse } from '#types/api'

import { selectTranslateFn } from './i18n'

/** Select course by name */
export const selectCourse = createSelector(
  [
    (state: RootState, name: ApiCourse['name']) =>
      contentApi.endpoints.getCourse.select(name)(state),
  ],
  (result) => result.data
)

/** Select current course */
export const selectCurrentCourse = createSelector(
  [(state: RootState) => state, selectCourseName],
  (state, courseName) => (courseName !== null ? selectCourse(state, courseName) : undefined)
)

/** Select available locales */
export const selectLocales = createSelector(
  [selectCurrentCourse],
  (course) => course?.locales || []
)

/** Select the course title */
export const selectCourseTitle = createSelector(
  [selectCurrentCourse, selectTranslateFn],
  (course, t) => t(course?.title)
)

/** Select the course description */
export const selectCourseDescription = createSelector(
  [selectCurrentCourse, selectTranslateFn],
  (course, t) => t(course?.description)
)

/** Select `homeLink` */
export const selectHomeLink = createSelector([selectCurrentCourse], (course) => course?.homeLink)
