import { createSelector } from '@reduxjs/toolkit'

import { selectLocale } from '#store/selectors/ui'
import type { LocalizedTitles } from '#types/api'
import type { LocalizedString } from '#types/common'

export type TranslateFn = (locString?: LocalizedString) => string | undefined

/** Select a translation function for localized content strings */
export const selectTranslateFn = createSelector(
  [selectLocale],
  (locale): TranslateFn =>
    (locString) =>
      locString?.[locale]
)

/** Translate title fields */
export function translateTitles<T extends LocalizedTitles>(objects: T[], t: TranslateFn) {
  return objects.map<T>((obj) => ({
    ...obj,
    shortTitle: obj.shortTitle !== undefined ? t(obj.shortTitle) : undefined,
    title: t(obj.title) ?? '',
  }))
}
