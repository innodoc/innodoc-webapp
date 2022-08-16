import { createSelector } from '@reduxjs/toolkit'

import { selectUi } from '../slices/uiSlice'

/** Select the current locale */
export const selectLocale = createSelector(selectUi, (ui) => ui.locale)

/** Select current palette mode (use system preference as fallback) */
export const selectPaletteMode = createSelector(
  selectUi,
  (ui) => ui.customPaletteMode || ui.systemPaletteMode
)

/** Select url info */
export const selectUrlWithoutLocale = createSelector(selectUi, (ui) => ui.urlWithoutLocale)
