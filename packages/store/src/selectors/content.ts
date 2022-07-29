import { createSelector } from '@reduxjs/toolkit'

import { selectManifest } from '../slices/contentApi'

import { selectLocale } from './ui'

function isNotNull<T>(arg: T): arg is Exclude<T, null> {
  return arg !== null
}

export const selectCourseTitle = createSelector(
  selectManifest,
  selectLocale,
  (manifest, locale) => {
    if (manifest !== undefined) {
      if (isNotNull(locale)) {
        return manifest.title[locale]
      }
    }

    return undefined
  }
)
