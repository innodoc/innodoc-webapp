import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { Locale } from '@/types/common'

import { RootState } from '../makeStore'

const NAME = 'ui'

interface UiSliceState {
  showTocDrawer: boolean
  locale: Locale | null
  urlWithoutLocale: string | null
}

const initialState: UiSliceState = {
  showTocDrawer: false,
  locale: null,
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

    /** Update url info */
    changeUrlWithoutLocale(state, action: PayloadAction<string>) {
      state.urlWithoutLocale = action.payload
    },

    toggleTocDrawer(state) {
      state.showTocDrawer = !state.showTocDrawer
    },
  },
})

export const selectUi = (state: RootState) => state[uiSlice.name]

export const { changeLocale, toggleTocDrawer, changeUrlWithoutLocale } = uiSlice.actions
export default uiSlice
