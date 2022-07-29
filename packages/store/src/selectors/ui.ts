import { createSelector } from '@reduxjs/toolkit'

import { selectUi } from '../slices/uiSlice'

/** Select the current locale. */
export const selectLocale = createSelector(selectUi, (ui) => ui.locale)

/** Select available locales. */
export const selectLocales = createSelector(selectUi, (ui) => ui.locales)
