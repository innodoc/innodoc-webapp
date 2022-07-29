import { createSelector } from '@reduxjs/toolkit'

import { selectUi } from '../slices/uiSlice'

export const selectLocale = createSelector(selectUi, (ui) => ui.locale)
