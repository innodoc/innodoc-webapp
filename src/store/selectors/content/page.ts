import { createSelector } from '@reduxjs/toolkit'

import type { Page } from '#types/api'

import { selectCourse } from './course'
import { selectTranslateFn } from './i18n'

/** Select pages */
export const selectPages = createSelector([selectCourse, selectTranslateFn], (course, t) => {
  return []
  // if (course?.pages === undefined) {
  //   return []
  // }
  // return course.pages.map(
  //   (page) =>
  //     ({
  //       ...page,
  //       shortTitle: t(page.shortTitle),
  //       title: t(page.title),
  //     } as Page)
  // )
})

/** Select main nav pages */
export const selectNavPages = createSelector([selectPages], (pages) =>
  pages.filter((page) => page.linked?.includes('nav'))
)

/** Select footer pages */
export const selectFooterPages = createSelector([selectPages], (pages) =>
  pages.filter((page) => page.linked?.includes('footer'))
)

/** Select page */
export const selectPageById = createSelector(
  [selectPages, (_, pageId: Page['id'] | undefined) => pageId],
  (pages, pageId) => pages.find((page) => page.id === pageId)
)
