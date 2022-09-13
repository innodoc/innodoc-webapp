import * as toolkitRaw from '@reduxjs/toolkit'

import { selectManifest } from '@/store/slices/contentApi'

import { selectTranslateFn } from './i18n'

const { createSelector } = ((toolkitRaw as any).default ?? toolkitRaw) as typeof toolkitRaw

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

/** Select `homeLink` */
export const selectHomeLink = createSelector(selectManifest, (manifest) => manifest?.homeLink)
