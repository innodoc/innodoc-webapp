import * as toolkitRaw from '@reduxjs/toolkit'

import { selectLocale } from '@/store/selectors/ui'
import type { LocalizedString } from '@/types/common'

const { createSelector } = ((toolkitRaw as any).default ?? toolkitRaw) as typeof toolkitRaw

export type TranslateFn = (locString?: LocalizedString) => string | undefined

/** Select a translation function for localized content strings */
export const selectTranslateFn = createSelector(
  selectLocale,
  (locale): TranslateFn =>
    (locString) =>
      locString?.[locale]
)
