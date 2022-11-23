import { createSelector } from '@reduxjs/toolkit'

import type { RootState } from '#store/makeStore'
import contentApi from '#store/slices/contentApi'
import type { ApiCourse, Page } from '#types/api'

import { selectCurrentCourse } from './course'
import { selectTranslateFn } from './i18n'

/** Select translated course pages by course name */
const selectCoursePages = createSelector(
  [
    (state: RootState, name: ApiCourse['name']) =>
      contentApi.endpoints.getCoursePages.select(name)(state),
    selectTranslateFn,
  ],
  (result, t) =>
    result.data !== undefined
      ? result.data.map<Page>((page) => ({
          ...page,
          shortTitle: page.shortTitle !== undefined ? t(page.shortTitle) : undefined,
          title: t(page.title) ?? '',
        }))
      : []
)

/** Select translated pages of current course */
const selectCurrentCoursePages = createSelector(
  [(state: RootState) => state, selectCurrentCourse],
  (state, currentCourse) =>
    currentCourse !== undefined ? selectCoursePages(state, currentCourse.name) : []
)

/** Select main nav pages */
export const selectNavPages = createSelector([selectCurrentCoursePages], (pages) =>
  pages.filter((page) => page.linked?.includes('nav'))
)

/** Select footer pages */
export const selectFooterPages = createSelector([selectCurrentCoursePages], (pages) =>
  pages.filter((page) => page.linked?.includes('footer'))
)

/** Select page */
export const selectPageByName = createSelector(
  [selectCurrentCoursePages, (_, pageName: Page['name'] | undefined) => pageName],
  (pages, pageName) => pages.find((page) => page.name === pageName)
)
