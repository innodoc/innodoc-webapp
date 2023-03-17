import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { DEFAULT_ROUTE_NAME } from '#constants'
import type { RootState } from '#store/makeStore'
import type { RouteInfo } from '#types/common'

interface appSliceState {
  /** Current page transition is hydration */
  isHydration: boolean

  /** Current route info */
  routeInfo: RouteInfo

  /** Route info of current transition */
  routeTransitionInfo: RouteInfo | null
}

const initialState: appSliceState = {
  isHydration: true,

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
    /** Change hydration state */
    changeIsHydration(state, action: PayloadAction<boolean>) {
      state.isHydration = action.payload
    },

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

/** Select app slice */
const selectApp = (state: RootState) => state[appSlice.name]

/** Select hydration state */
export const selectIsHydration = (state: RootState) => selectApp(state).isHydration

/** Select current route info */
export const selectRouteInfo = (state: RootState) => selectApp(state).routeInfo

/** Select current transition route info */
export const selectRouteTransitionInfo = (state: RootState) => selectApp(state).routeTransitionInfo

export const { changeIsHydration, changeRouteInfo, changeRouteTransitionInfo } = appSlice.actions
export default appSlice
