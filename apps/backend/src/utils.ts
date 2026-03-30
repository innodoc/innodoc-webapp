import type { RouteManager } from '@innodoc/shared-core/routes'
import type { FrontendRouteName } from '@innodoc/shared-core/types'

/**
 * Get URL path for API route handler.
 *
 * @param routeManager RouteManager instance
 * @param name Name of the API route
 * @param removePrefix Optional route path prefix to strip
 * @returns Route path
 * @throws if unknown route name was given
 */
function getRoutePath(routeManager: RouteManager, name: FrontendRouteName, removePrefix?: string) {
  const frontendRoutes = routeManager.getFrontendRoutes()

  const pattern = frontendRoutes[name]
  if (pattern === undefined) {
    throw new Error(`Unknown route requested: ${name}`)
  }

  return removePrefix === undefined
    ? pattern
    : pattern.replace(new RegExp(`^${removePrefix.replace('/', String.raw`\/`)}`), '')
}

export { getRoutePath }
