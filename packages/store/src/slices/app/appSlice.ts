import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { DEFAULT_ROUTE_NAME } from '@innodoc/constants'
import type { RouteInfo } from '@innodoc/routes/types'

import { selectRouteInfo, selectRouteTransitionInfo } from './selectors'

interface appSliceState {
  /** Current route info */
  routeInfo: RouteInfo

  /** Route info of current transition */
  routeTransitionInfo: RouteInfo | null
}

const initialState: appSliceState = {
  routeInfo: {
    courseSlug: null,
    routeName: DEFAULT_ROUTE_NAME,
    locale: 'en',
  },

  routeTransitionInfo: null,
}

const appSlice = createSlice({
  name: 'app',
  initialState,

  reducers: {
    /** Change current route info */
    changeRouteInfo(state, action: PayloadAction<RouteInfo>) {
      state.routeInfo = action.payload
    },

    /** Change route transition info */
    changeRouteTransitionInfo(state, action: PayloadAction<RouteInfo | null>) {
      state.routeTransitionInfo = action.payload
    },
  },
})

export { selectRouteInfo, selectRouteTransitionInfo }
export const { changeRouteInfo, changeRouteTransitionInfo } = appSlice.actions
export default appSlice
