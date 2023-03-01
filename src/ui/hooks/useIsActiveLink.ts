import { selectRouteInfo } from '#store/slices/appSlice'
import type { RouteInfo } from '#types/common'

import { useSelector } from './store'

function useIsActiveLink() {
  const currentRouteInfo = useSelector(selectRouteInfo)
  return (partialRouteInfo: Partial<RouteInfo>) => {
    const routeInfo = { ...currentRouteInfo, ...partialRouteInfo }

    for (const key of Object.keys(currentRouteInfo) as Array<keyof RouteInfo>) {
      if (currentRouteInfo[key] !== routeInfo[key]) return false
    }
    return true
  }
}

export default useIsActiveLink
