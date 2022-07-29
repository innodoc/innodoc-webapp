import { createSelector } from '@reduxjs/toolkit'

import { isNotNull, LocalizedString } from '@innodoc/types'

import { selectManifest } from '../slices/contentApi'

import { selectLocale } from './ui'

type TranslateFn = (locString: LocalizedString) => string | undefined

/** Select a translation function for localized content strings. */
const selectTranslateFn = createSelector(
  selectLocale,
  (locale): TranslateFn =>
    (locString) =>
      isNotNull(locale) ? locString[locale] : undefined
)

/** Select the course title. */
export const selectCourseTitle = createSelector(
  selectManifest,
  selectTranslateFn,
  (manifest, translate) => (manifest !== undefined ? translate(manifest.title) : undefined)
)
