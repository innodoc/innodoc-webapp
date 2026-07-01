import type { RouteManager } from '@innodoc/shared-core/routes'
import type { ApiRouteName, FrontendRouteName, RouteName } from '@innodoc/shared-core/types'

/**
 * Get URL path for a route handler.
 *
 * @param routeManager RouteManager instance
 * @param name Name of the route
 * @param removePrefix Optional route path prefix to strip
 * @returns Route path
 * @throws if unknown route name was given
 */
function getRoutePath(routeManager: RouteManager, name: RouteName, removePrefix?: string) {
  const apiRoutes = routeManager.getApiRoutes()
  const pattern = apiRoutes[name as ApiRouteName]
  if (pattern !== undefined) {
    return removePrefix === undefined
      ? pattern
      : pattern.replace(new RegExp(`^${removePrefix.replace('/', String.raw`\/`)}`, 'u'), '')
  }

  const frontendRoutes = routeManager.getFrontendRoutes()
  const frontendPattern = frontendRoutes[name as FrontendRouteName]
  if (frontendPattern !== undefined) {
    return removePrefix === undefined
      ? frontendPattern
      : frontendPattern.replace(new RegExp(`^${removePrefix.replace('/', String.raw`\/`)}`, 'u'), '')
  }

  throw new Error(`Unknown route requested: ${name}`)
}

export { getRoutePath }
