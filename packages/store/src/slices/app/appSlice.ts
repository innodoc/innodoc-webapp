import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { DEFAULT_LOCALES, DEFAULT_ROUTE_NAME } from '@innodoc/constants'
import type { AppRouteInfo } from '@innodoc/routes/types/routeInfos'

import { selectRouteInfo, selectRouteTransitionInfo } from './selectors'

interface appSliceState {
  /** Current route info */
  routeInfo: AppRouteInfo

  /** Route info of current transition */
  routeTransitionInfo: AppRouteInfo | null
}

const initialState: appSliceState = {
  routeInfo: {
    name: DEFAULT_ROUTE_NAME,
    locale: DEFAULT_LOCALES[0],
  },

  routeTransitionInfo: null,
}

const appSlice = createSlice({
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

export { selectRouteInfo, selectRouteTransitionInfo }
export const { changeRouteInfo, changeRouteTransitionInfo } = appSlice.actions
export default appSlice
