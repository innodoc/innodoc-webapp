import getRouteManager from '#routes/getRouteManager'
import { selectRouteInfo } from '#store/slices/appSlice'
import type { RouteInfo } from '#types/common'
import { useSelector } from '#ui/hooks/store/store'

const routeManager = getRouteManager()

function useRouteManager() {
  const currentRouteInfo = useSelector(selectRouteInfo)

  return {
    /** Generate URL path from route name and parameters */
    generateUrl: ({ routeName, ...params }: Partial<RouteInfo>) => {
      const { routeName: currentRouteName, ...currentParams } = currentRouteInfo
      return routeManager.generate(routeName ?? currentRouteName, { ...currentParams, ...params })
    },

    /** Check if is active route */
    isActiveRoute: (partialRouteInfo: Partial<RouteInfo>) => {
      const routeInfo = { ...currentRouteInfo, ...partialRouteInfo }

      for (const key of Object.keys(currentRouteInfo) as Array<keyof RouteInfo>) {
        if (currentRouteInfo[key] !== routeInfo[key]) {
          return false
        }
      }
      return true
    },

    /** Parse link specifier params */
    parseLinkSpecifier: (...args: Parameters<typeof routeManager.parseLinkSpecifier>) =>
      routeManager.parseLinkSpecifier(...args),
  }
}

export default useRouteManager
