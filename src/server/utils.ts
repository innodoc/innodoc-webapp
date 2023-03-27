import RouteManager from '#routes/RouteManager'
import config from '#server/config'
import type { ApiRouteName } from '#types/routes'
import { isArbitraryObject } from '#types/typeGuards'

export function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return isArbitraryObject(error) && error instanceof Error && typeof error.code === 'string'
}

/** Return `RouteManager` instance (Node.js) */
export function getRouteManager() {
  return RouteManager.getInstance(
    config.courseSlugMode,
    config.pagePathPrefix,
    config.sectionPathPrefix
  )
}

/** Get URL path for API route handlers */
export function getRoutePath(name: ApiRouteName, removePrefix?: string) {
  const apiRoutes = getRouteManager().getApiRoutes()

  const pattern = apiRoutes[name]
  if (pattern === undefined) {
    throw new Error(`Unknown route requested: ${name}`)
  }

  return removePrefix === undefined
    ? pattern
    : pattern.replace(new RegExp(`^${removePrefix.replace('/', '\\/')}`), '')
}
