import { useMemo } from 'react'

import getRouteManager from '#routes/getRouteManager'
import { selectRouteInfo } from '#store/slices/appSlice'
import type { RouteInfo } from '#types/common'
import { useSelector } from '#ui/hooks/store/store'

const routeManager = getRouteManager()

function useRouteManager() {
  const currentRouteInfo = useSelector(selectRouteInfo)

  return useMemo(() => {
    const { routeName: currentRouteName, ...currentParams } = currentRouteInfo

    return {
      /** Generate URL path from route name and parameters */
      generateUrl: ({ routeName, ...params }: Partial<RouteInfo>) =>
        routeManager.generate(routeName ?? currentRouteName, { ...currentParams, ...params }),

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
  }, [currentRouteInfo])
}

export default useRouteManager
