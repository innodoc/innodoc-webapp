import { createSelector } from '@reduxjs/toolkit'

import { selectManifest } from '@/store/slices/contentApi'

import { selectTranslateFn } from './i18n'

/** Select available locales */
export const selectLocales = createSelector(selectManifest, (manifest) => manifest?.languages || [])

/** Select the course title */
export const selectCourseTitle = createSelector(
  [selectManifest, selectTranslateFn],
  (manifest, t) => t(manifest?.title)
)

/** Select the course description */
export const selectCourseDescription = createSelector(
  [selectManifest, selectTranslateFn],
  (manifest, t) => t(manifest?.description)
)

/** Select the course logo */
export const selectCourseLogo = createSelector([selectManifest], (manifest) => manifest?.logo)

/** Select `homeLink` */
export const selectHomeLink = createSelector(selectManifest, (manifest) => manifest?.homeLink)
