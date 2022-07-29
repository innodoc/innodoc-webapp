import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

import { Locale } from '@innodoc/types'

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
    changeLocale(state, action: PayloadAction<Locale>) {
      state.locale = action.payload
    },

    setLocales(state, action: PayloadAction<Locale[]>) {
      state.locales = action.payload
    },

    toggleTocDrawer(state) {
      state.showTocDrawer = !state.showTocDrawer
    },
  },

  extraReducers: {
    [HYDRATE]: (state, action: HydrateAction) => {
      const subState = action.payload[NAME]
      state.locale = subState.locale
      state.locales = subState.locales
    },
  },
})

export const selectUi = (state: RootState) => state[uiSlice.name]

export const { changeLocale, setLocales, toggleTocDrawer } = uiSlice.actions
export default uiSlice
