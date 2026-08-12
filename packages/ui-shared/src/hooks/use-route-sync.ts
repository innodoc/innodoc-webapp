import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { changeRouteInfo } from '@innodoc/shared-store/slices/app'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { useDispatch } from '@innodoc/ui-shared/store-hooks'

/**
 * Sync URL changes with Redux store route info.
 *
 * This hook listens to wouter's location changes and updates the
 * `routeInfo` in the store, which triggers content fetching
 * for client-side navigation via the hastListenerMiddleware.
 *
 * TODO: This is a temporary fix. The proper approach is to use the
 * `RouteTransition` component (currently disabled) which would:
 * 1. Listen to `routeTransitionInfo` changes
 * 2. Wait for content to be fetched
 * 3. Then update `routeInfo` after content is ready
 * This would provide smooth page transitions and prevent showing
 * stale content during navigation.
 */
function useRouteSync() {
  const [location] = useLocation()
  const routeManager = useRouteManager()
  const dispatch = useDispatch()

  useEffect(() => {
    // Parse the current URL and update routeInfo
    const routeInfo = routeManager.parseRouteFromUrl(location)
    if (routeInfo) {
      dispatch(changeRouteInfo(routeInfo))
    } else {
      // No matching route, clear route info
      dispatch(changeRouteInfo({ name: 'app:index', locale: 'en' }))
    }
  }, [location, routeManager, dispatch])
}

export default useRouteSync
