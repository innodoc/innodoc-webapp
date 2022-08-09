import type { PaletteMode } from '@mui/material'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { Locale } from '@/types/common'

import { RootState } from '../makeStore'

const NAME = 'ui'

interface UiSliceState {
  locale: Locale
  showTocDrawer: boolean
  theme: PaletteMode | null
  urlWithoutLocale: string | null
}

const initialState: UiSliceState = {
  locale: 'en',
  showTocDrawer: false,
  theme: null,
  urlWithoutLocale: null,
}

const uiSlice = createSlice({
  name: NAME,
  initialState,

  reducers: {
    /** Change locale */
    changeLocale(state, action: PayloadAction<Locale>) {
      state.locale = action.payload
    },

    /** Switch theme */
    changeTheme(state, action: PayloadAction<PaletteMode>) {
      state.theme = action.payload
    },

    /** Update url info */
    changeUrlWithoutLocale(state, action: PayloadAction<string>) {
      state.urlWithoutLocale = action.payload
    },

    /** Toggle TOC drawer */
    toggleTocDrawer(state) {
      state.showTocDrawer = !state.showTocDrawer
    },
  },
})

export const selectUi = (state: RootState) => state[uiSlice.name]

export const { changeLocale, changeTheme, toggleTocDrawer, changeUrlWithoutLocale } =
  uiSlice.actions
export default uiSlice
