import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { DEFAULT_LOCALES, DEFAULT_ROUTE_NAME } from '@innodoc/shared-core/constants'
import type { FrontendRouteInfo } from '@innodoc/shared-core/types'

import { selectRouteInfo, selectRouteTransitionInfo } from './selectors.js'

interface AppSliceState {
  /** Current route info */
  routeInfo: FrontendRouteInfo

  /** Route info of current transition */
  routeTransitionInfo: FrontendRouteInfo | null
}

const initialState: AppSliceState = {
  routeInfo: {
    name: DEFAULT_ROUTE_NAME,
    locale: DEFAULT_LOCALES[0] ?? 'en',
  },

  routeTransitionInfo: null,
}

const appSlice = createSlice({
  name: 'app',
  initialState,

  reducers: {
    /** Change current route info */
    changeRouteInfo(state, action: PayloadAction<FrontendRouteInfo>) {
      state.routeInfo = action.payload
    },

    /** Change route transition info */
    changeRouteTransitionInfo(state, action: PayloadAction<FrontendRouteInfo | null>) {
      state.routeTransitionInfo = action.payload
    },
  },
})

export type { AppSliceState }
export { selectRouteInfo, selectRouteTransitionInfo }
export const { changeRouteInfo, changeRouteTransitionInfo } = appSlice.actions
export default appSlice
