import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { DEFAULT_ROUTE_NAME } from '#constants'
import type { RootState } from '#store/makeStore'
import type { RouteInfo } from '#types/common'

interface appSliceState {
  /** Current route info */
  routeInfo: RouteInfo
}

const initialState: appSliceState = {
  routeInfo: {
    courseSlug: null,
    routeName: DEFAULT_ROUTE_NAME,
    locale: 'en',
  },
}

const appSlice = createSlice({
  name: 'app',
  initialState,

  reducers: {
    /** Change current route info */
    changeRouteInfo(state, action: PayloadAction<RouteInfo>) {
      state.routeInfo = action.payload
    },
  },
})

/** Select app slice */
const selectApp = (state: RootState) => state[appSlice.name]

/** Select current route name */
export const selectRouteInfo = (state: RootState) => selectApp(state).routeInfo

export const { changeRouteInfo } = appSlice.actions
export default appSlice
