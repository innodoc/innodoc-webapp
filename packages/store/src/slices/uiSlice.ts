import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { Locale } from '@innodoc/types'

interface UiSliceState {
  showTocDrawer: boolean
  currentLocale: Locale | null
}

const initialState: UiSliceState = {
  showTocDrawer: false,
  currentLocale: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    changeLocale(state, action: PayloadAction<Locale>) {
      state.currentLocale = action.payload
    },
    toggleTocDrawer(state) {
      state.showTocDrawer = !state.showTocDrawer
    },
  },
})

export const { changeLocale, toggleTocDrawer } = uiSlice.actions
export default uiSlice
