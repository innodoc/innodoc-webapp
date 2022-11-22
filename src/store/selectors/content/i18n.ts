import { createSelector } from '@reduxjs/toolkit'

import { selectLocale } from '#store/selectors/ui'
import type { LocalizedString } from '#types/common'

export type TranslateFn = (locString?: LocalizedString) => string | undefined

/** Select a translation function for localized content strings */
export const selectTranslateFn = createSelector(
  selectLocale,
  (locale): TranslateFn =>
    (locString) =>
      locString?.[locale]
)
