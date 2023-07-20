import type { RootState } from '#types'

/** Select app slice */
const selectApp = (state: RootState) => state.app

/** Select current route info */
export const selectRouteInfo = (state: RootState) => selectApp(state).routeInfo

/** Select current transition route info */
export const selectRouteTransitionInfo = (state: RootState) => selectApp(state).routeTransitionInfo
