import { createSelector } from '@reduxjs/toolkit'

import type { RootState } from '#store/makeStore'
import contentApi from '#store/slices/contentApi'
import type { Page } from '#types/api'

import { selectCurrentCourse } from './course'
import { selectTranslateFn, translateTitles } from './i18n'

/** Select translated pages of current course */
const selectCoursePages = createSelector(
  [(state: RootState) => state, selectCurrentCourse, selectTranslateFn],
  (state, course, t) => {
    if (course === undefined) return []
    const { data } = contentApi.endpoints.getCoursePages.select(course.name)(state)
    return data !== undefined ? translateTitles(data, t) : []
  }
)

/** Select main nav pages */
export const selectNavPages = createSelector([selectCoursePages], (pages) =>
  pages.filter((page) => page.linked?.includes('nav'))
)

/** Select footer pages */
export const selectFooterPages = createSelector([selectCoursePages], (pages) =>
  pages.filter((page) => page.linked?.includes('footer'))
)

/** Select page */
export const selectPageByName = createSelector(
  [selectCoursePages, (_, pageName: Page['name'] | undefined) => pageName],
  (pages, pageName) => pages.find((page) => page.name === pageName)
)
