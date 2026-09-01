import type { RouteManager } from '@innodoc/shared-core/routes'
import type { FrontendRouteInfo } from '@innodoc/shared-core/types'
import { useMemo } from 'react'
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

  // Both deps are stable references: `routeManager` is cached per entity API and
  // `currentRouteInfo` only changes on navigation. Memoising keeps the returned object (and its
  // closures) stable across re-renders, so `React.memo` link children can bail out on unrelated
  // store changes instead of re-rendering with a fresh `url` on every render.
  return useMemo(
    () => ({
      /**
       * Generate URL path from `Partial<FrontendRouteInfo>`.
       *
       * @param partialRouteInfo partial `FrontendRouteInfo` object
       * @returns URL
       */
      url: (partialRouteInfo) => {
        const routeInfo = { ...currentRouteInfo, ...partialRouteInfo }
        return routeManager.generateFrontendUrlPath(routeInfo)
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

      // Plain delegation without useCallback (no-unnecessary-use-memo); the arrow keeps `this` bound.
      parseLinkSpecifier: (...args) => routeManager.parseLinkSpecifier(...args),
    }),
    [routeManager, currentRouteInfo],
  )
}

export default useRoutes
