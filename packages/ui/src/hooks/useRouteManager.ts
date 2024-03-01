import getRouteManager from '@innodoc/routes/vite/getRouteManager'
import { selectRouteInfo } from '@innodoc/store/slices/app'
import type { AppRouteName, ParamTypeForGenerator, RouteInfo } from '@innodoc/routes/types'

import { useSelector } from '#hooks/redux'

const routeManager = getRouteManager()

function useRouteManager() {
  const currentRouteInfo = useSelector(selectRouteInfo)

  return {
    /** Generate URL path from route name and parameters */
    generateUrl: ({ name: routeName, ...params }: Partial<RouteInfo>) => {
      const { name: currentRouteName, ...currentParams } = currentRouteInfo
      const resultingParams = { ...currentParams, ...params } as ParamTypeForGenerator<AppRouteName>
      return routeManager.generate(routeName ?? currentRouteName, resultingParams)
    },

    /** Check if is active route */
    isActiveRoute: (partialRouteInfo: Partial<RouteInfo>) => {
      const routeInfo = { ...currentRouteInfo, ...partialRouteInfo }

      for (const key of Object.keys(currentRouteInfo) as (keyof RouteInfo)[]) {
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
