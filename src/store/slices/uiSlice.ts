import type { PaletteMode } from '@mui/material'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { Locale } from '@/types/common'

import { RootState } from '../makeStore'

const NAME = 'ui'

interface UiSliceState {
  /** User-selected color palette */
  customPaletteMode: PaletteMode | null

  /** Current locale */
  locale: Locale

  /** System prefered palette mode (`prefers-color-scheme`) */
  systemPaletteMode: PaletteMode | null

  /** Current URL path without locale prefix */
  urlWithoutLocale: string | null
}

const initialState: UiSliceState = {
  customPaletteMode: null,
  locale: 'en',
  systemPaletteMode: null,
  urlWithoutLocale: null,
}

const uiSlice = createSlice({
  name: NAME,
  initialState,

  reducers: {
    /** Switch user-selected palette mode */
    changeCustomPaletteMode(state, action: PayloadAction<PaletteMode>) {
      state.customPaletteMode = action.payload
    },

    /** Change locale */
    changeLocale(state, action: PayloadAction<Locale>) {
      state.locale = action.payload
    },

    /** Change system palette mode (`prefers-color-scheme`) */
    changeSystemPaletteMode(state, action: PayloadAction<PaletteMode>) {
      state.systemPaletteMode = action.payload
    },

    /** Update url info */
    changeUrlWithoutLocale(state, action: PayloadAction<string>) {
      state.urlWithoutLocale = action.payload
    },
  },
})

export const selectUi = (state: RootState) => state[uiSlice.name]

export const {
  changeCustomPaletteMode,
  changeLocale,
  changeSystemPaletteMode,
  changeUrlWithoutLocale,
} = uiSlice.actions
export default uiSlice
