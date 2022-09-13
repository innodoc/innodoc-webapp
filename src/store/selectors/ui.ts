import * as toolkitRaw from '@reduxjs/toolkit'

import { selectUi } from '@/store/slices/uiSlice'

const { createSelector } = ((toolkitRaw as any).default ?? toolkitRaw) as typeof toolkitRaw

/** Select the current locale */
export const selectLocale = createSelector(selectUi, (ui) => ui.locale)

/** Select url info */
export const selectUrlWithoutLocale = createSelector(selectUi, (ui) => ui.urlWithoutLocale)
