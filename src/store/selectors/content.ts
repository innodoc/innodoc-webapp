import { createSelector } from '@reduxjs/toolkit'

import { selectManifest } from '@/store/slices/contentApi'
import type { Page } from '@/types/api'
import type { LocalizedString } from '@/types/common'

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

/** Select main nav pages */
export const selectNavPages = createSelector([selectPages], (pages) =>
  pages.filter((page) => page.linked?.includes('nav'))
)

/** Select footer pages */
export const selectFooterPages = createSelector([selectPages], (pages) =>
  pages.filter((page) => page.linked?.includes('footer'))
)

/** Select page. */
export const selectPageById = createSelector(
  [selectPages, (_, pageId: Page['id']) => pageId],
  (pages, pageId) => pages.find((page) => page.id === pageId)
)
