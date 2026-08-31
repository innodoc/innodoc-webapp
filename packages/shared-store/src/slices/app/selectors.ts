import type { RootState } from '#types'

/** Select app slice */
const selectApp = (state: RootState) => state.app

/** Select current route info */
const selectRouteInfo = (state: RootState) => selectApp(state).routeInfo

export { selectRouteInfo }
