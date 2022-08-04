import { createSelector } from '@reduxjs/toolkit'

import { selectUi } from '../slices/uiSlice'

/** Select the current locale */
export const selectLocale = createSelector(selectUi, (ui) => ui.locale)

/** Select current theme */
export const selectTheme = createSelector(selectUi, (ui) => ui.theme)

/** Select url info */
export const selectUrlWithoutLocale = createSelector(selectUi, (ui) => ui.urlWithoutLocale)
