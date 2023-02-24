import { selectRouteInfo } from '#store/slices/appSlice'
import type { RouteInfo } from '#types/common'
import { useSelector } from '#ui/hooks/store'

import getRoutes from './getRoutes'

const { generateUrl } = getRoutes()

function useGenerateUrl() {
  const { routeName: currentRouteName, ...currentParams } = useSelector(selectRouteInfo)
  return ({ routeName, ...params }: Partial<RouteInfo>) =>
    generateUrl(routeName ?? currentRouteName, { ...currentParams, ...params })
}

export default useGenerateUrl
