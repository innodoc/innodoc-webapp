import getRouteManager from '@innodoc/routes/vite/getRouteManager'
import { selectRouteInfo } from '@innodoc/store/slices/app'
import type { AppRouteInfo } from '@innodoc/routes/types/routeInfos'

import { useSelector } from './store/redux.js'

const routeManager = getRouteManager()

function useRouteManager() {
  const currentRouteInfo = useSelector(selectRouteInfo)

  return {
    /**
     * Generate URL path from `Partial<AppRouteInfo>`.
     *
     * @param routeInfo partial `AppRouteInfo` object
     * @returns URL
     */
    url: (partialRouteInfo: Partial<AppRouteInfo>) => {
      const routeInfo = { ...currentRouteInfo, ...partialRouteInfo }
      return routeManager.generateAppUrlPath(routeInfo)
    },

    /**
     * Check if `partialRouteInfo` is current route.
     *
     * @param partialRouteInfo partial `AppRouteInfo` object
     * @returns `true` if `partialRouteInfo` is current route
     */
    isActiveRoute: (partialRouteInfo?: Record<string, unknown>) => {
      const routeInfo = { ...currentRouteInfo, ...partialRouteInfo }

      for (const key of Object.keys(currentRouteInfo) as (keyof AppRouteInfo)[]) {
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
