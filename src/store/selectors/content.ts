import { createSelector } from '@reduxjs/toolkit'

import { LocalizedString } from '@/types/common'

import { selectManifest } from '../slices/contentApi'

import { selectLocale } from './ui'

type TranslateFn = (locString?: LocalizedString) => string | undefined

/** Select a translation function for localized content strings. */
const selectTranslateFn = createSelector(
  selectLocale,
  (locale): TranslateFn =>
    (locString) =>
      locale !== null && locString !== undefined ? locString[locale] : undefined
)

/** Select available locales. */
export const selectLocales = createSelector(selectManifest, (manifest) => manifest?.languages || [])

/** Select the course title. */
export const selectCourseTitle = createSelector(
  [selectManifest, selectTranslateFn],
  (manifest, translate) => (manifest !== undefined ? translate(manifest.title) : undefined)
)

/** Select pages. */
export const selectPages = createSelector(
  [selectManifest, selectTranslateFn],
  (manifest, translate) => {
    if (manifest?.pages === undefined) {
      return []
    }
    return manifest.pages.map((page) => ({
      ...page,
      shortTitle: translate(page.shortTitle),
      title: translate(page.title),
    }))
  }
)
