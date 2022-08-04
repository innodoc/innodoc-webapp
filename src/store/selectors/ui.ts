import { createSelector } from '@reduxjs/toolkit'

import { selectUi } from '../slices/uiSlice'

/** Select the current locale. */
export const selectLocale = createSelector(selectUi, (ui) => ui.locale)

/** Select url info. */
export const selectUrlWithoutLocale = createSelector(selectUi, (ui) => ui.urlWithoutLocale)
