import getRouteManager from '#routes/getRouteManager'
import { selectRouteInfo } from '#store/slices/appSlice'
import type { RouteInfo } from '#types/common'
import { useSelector } from '#ui/hooks/store/store'

const routeManager = getRouteManager()

function useGenerateUrl() {
  const { routeName: currentRouteName, ...currentParams } = useSelector(selectRouteInfo)
  return ({ routeName, ...params }: Partial<RouteInfo>) =>
    routeManager.generate(routeName ?? currentRouteName, { ...currentParams, ...params })
}

export default useGenerateUrl
