import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction, Slice } from '@reduxjs/toolkit'

import { DEFAULT_LOCALES, DEFAULT_ROUTE_NAME } from '@innodoc/constants'
import type { AppRouteInfo } from '@innodoc/routes/types/routeInfos'

import { selectRouteInfo, selectRouteTransitionInfo } from './selectors.js'

interface AppSliceState {
  /** Current route info */
  routeInfo: AppRouteInfo

  /** Route info of current transition */
  routeTransitionInfo: AppRouteInfo | null
}

const initialState: AppSliceState = {
  routeInfo: {
    name: DEFAULT_ROUTE_NAME,
    locale: DEFAULT_LOCALES[0] ?? 'en',
  },

  routeTransitionInfo: null,
}

const appSlice: Slice<AppSliceState> = createSlice({
  name: 'app',
  initialState,

  reducers: {
    /** Change current route info */
    changeRouteInfo(state, action: PayloadAction<AppRouteInfo>) {
      state.routeInfo = action.payload
    },

    /** Change route transition info */
    changeRouteTransitionInfo(state, action: PayloadAction<AppRouteInfo | null>) {
      state.routeTransitionInfo = action.payload
    },
  },
})

export type { AppSliceState }
export { selectRouteInfo, selectRouteTransitionInfo }
export const { changeRouteInfo, changeRouteTransitionInfo } = appSlice.actions
export default appSlice
