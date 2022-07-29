import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

import { Locale } from '@innodoc/types'

import { RootState } from '../makeStore'

const NAME = 'ui'

interface UiSliceState {
  showTocDrawer: boolean
  locale: Locale | null
}

type HydrateAction = PayloadAction<{ [NAME]: UiSliceState }>

const initialState: UiSliceState = {
  showTocDrawer: false,
  locale: null,
}

const uiSlice = createSlice({
  name: NAME,
  initialState,

  reducers: {
    changeLocale(state, action: PayloadAction<Locale>) {
      state.locale = action.payload
    },
    toggleTocDrawer(state) {
      state.showTocDrawer = !state.showTocDrawer
    },
  },

  extraReducers: {
    [HYDRATE]: (state, action: HydrateAction) => {
      state.locale = action.payload[NAME].locale
    },
  },
})

export const selectUi = (state: RootState) => state[uiSlice.name]

export const { changeLocale, toggleTocDrawer } = uiSlice.actions
export default uiSlice
