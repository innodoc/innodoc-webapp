import type { RouteManager } from '@innodoc/shared-core/routes'
import type { FrontendRouteInfo } from '@innodoc/shared-core/types'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { useSelector } from './redux.js'

interface UseRoutesReturn {
  url: (partialRouteInfo: Partial<FrontendRouteInfo>) => string
  isActiveRoute: (partialRouteInfo?: Record<string, unknown>) => boolean
  parseLinkSpecifier: RouteManager['parseLinkSpecifier']
}

function useRoutes(): UseRoutesReturn {
  const routeManager = useRouteManager()
  const currentRouteInfo = useSelector(selectRouteInfo)

  return {
    /**
     * Generate URL path from `Partial<FrontendRouteInfo>`.
     *
     * @param routeInfo partial `FrontendRouteInfo` object
     * @returns URL
     */
    url: (partialRouteInfo) => {
      const routeInfo = { ...currentRouteInfo, ...partialRouteInfo }
      try {
        return routeManager.generateFrontendUrlPath(routeInfo)
      } catch (error) {
        console.error('[useRoutes] URL generation error:', {
          error,
          currentRouteInfo,
          partialRouteInfo,
          combinedRouteInfo: routeInfo,
        })
        throw error
      }
    },

    /**
     * Check if `partialRouteInfo` is current route.
     *
     * @param partialRouteInfo partial `FrontendRouteInfo` object
     * @returns `true` if `partialRouteInfo` is current route
     */
    isActiveRoute: (partialRouteInfo) => {
      const routeInfo = { ...currentRouteInfo, ...partialRouteInfo }

      for (const key of Object.keys(currentRouteInfo) as (keyof FrontendRouteInfo)[]) {
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

export default useRoutes
