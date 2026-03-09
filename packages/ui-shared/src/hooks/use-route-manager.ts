import getRouteManager from '@innodoc/shared-core/routes/manager/vite'
import { useSelector } from '@innodoc/ui-store/hooks'
import { selectRouteInfo } from '@innodoc/ui-store/slices/app'
import type { RouteManager } from '@innodoc/shared-core/routes'
import type { AppRouteInfo } from '@innodoc/shared-core/types'

interface UseRouteManagerReturn {
  url: (partialRouteInfo: Partial<AppRouteInfo>) => string
  isActiveRoute: (partialRouteInfo?: Record<string, unknown>) => boolean
  parseLinkSpecifier: RouteManager['parseLinkSpecifier']
}

function useRouteManager(): UseRouteManagerReturn {
  const routeManager = getRouteManager()
  const currentRouteInfo = useSelector(selectRouteInfo)

  return {
    /**
     * Generate URL path from `Partial<AppRouteInfo>`.
     *
     * @param routeInfo partial `AppRouteInfo` object
     * @returns URL
     */
    url: (partialRouteInfo) => {
      const routeInfo = { ...currentRouteInfo, ...partialRouteInfo }
      return routeManager.generateAppUrlPath(routeInfo)
    },

    /**
     * Check if `partialRouteInfo` is current route.
     *
     * @param partialRouteInfo partial `AppRouteInfo` object
     * @returns `true` if `partialRouteInfo` is current route
     */
    isActiveRoute: (partialRouteInfo) => {
      const routeInfo = { ...currentRouteInfo, ...partialRouteInfo }

      for (const key of Object.keys(currentRouteInfo) as (keyof AppRouteInfo)[]) {
        if (currentRouteInfo[key] !== routeInfo[key]) {
          return false
        }
      }
      return true
    },

    /** Parse link specifier params */
    parseLinkSpecifier: (...args) => routeManager.parseLinkSpecifier(...args),
  }
}

export default useRouteManager
