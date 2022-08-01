import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
// import { HYDRATE } from 'next-redux-wrapper'

import type { Locale } from '@innodoc/types'

import { RootState } from '../makeStore'

const NAME = 'ui'

interface UiSliceState {
  showTocDrawer: boolean
  locale: Locale | null
  locales: Locale[]
}

type HydrateAction = PayloadAction<{ [NAME]: UiSliceState }>

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

  extraReducers: {
    // [HYDRATE]: (state, action: HydrateAction) => {
    //   // Locale is managed by next/router and passed to client store here
    //   const subState = action.payload[NAME]
    //   state.locale = subState.locale
    //   state.locales = subState.locales
    // },
  },
})

export const selectUi = (state: RootState) => state[uiSlice.name]

export const { changeLocale, toggleTocDrawer } = uiSlice.actions
export default uiSlice
