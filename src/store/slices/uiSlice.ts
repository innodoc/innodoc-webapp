import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { Locale } from '@/types/common'

import { RootState } from '../makeStore'

const NAME = 'ui'

interface UiSliceState {
  showTocDrawer: boolean
  locale: Locale | null
  locales: Locale[]
}

const initialState: UiSliceState = {
  showTocDrawer: false,
  locale: null,
  locales: [],
}

const uiSlice = createSlice({
  name: NAME,
  initialState,

  reducers: {
    /** Only dispatched server-side */
    changeLocale(state, action: PayloadAction<{ locale: Locale; locales: Locale[] }>) {
      state.locale = action.payload.locale
      state.locales = action.payload.locales
    },

    toggleTocDrawer(state) {
      state.showTocDrawer = !state.showTocDrawer
    },
  },
})

export const selectUi = (state: RootState) => state[uiSlice.name]

export const { changeLocale, toggleTocDrawer } = uiSlice.actions
export default uiSlice
