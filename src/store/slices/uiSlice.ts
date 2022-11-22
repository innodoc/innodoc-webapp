import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '#store/makeStore'
import type { Locale } from '#types/common'

interface UiSliceState {
  /** Current locale */
  locale: Locale

  /** Current URL path without locale prefix */
  urlWithoutLocale: string | null
}

const initialState: UiSliceState = {
  locale: 'en',
  urlWithoutLocale: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,

  reducers: {
    /** Change locale */
    changeLocale(state, action: PayloadAction<Locale>) {
      state.locale = action.payload
    },

    /** Update url info */
    changeUrlWithoutLocale(state, action: PayloadAction<string>) {
      state.urlWithoutLocale = action.payload
    },
  },
})

export const selectUi = (state: RootState) => state[uiSlice.name]

export const { changeLocale, changeUrlWithoutLocale } = uiSlice.actions
export default uiSlice
