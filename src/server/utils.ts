import RouteManager from '#routes/RouteManager'
import type { RouteName } from '#routes/routes'
import config from '#server/config'
import { isArbitraryObject } from '#types/typeGuards'

export function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return isArbitraryObject(error) && error instanceof Error && typeof error.code === 'string'
}

/** Get URL path for API route handlers */
export function getRoutePath(name: RouteName, removePrefix?: string) {
  const routeManager = RouteManager.getInstance(
    config.courseSlugMode,
    config.pagePathPrefix,
    config.sectionPathPrefix
  )
  const apiRoutes = routeManager.getApiRoutes()

  const pattern = apiRoutes[name]
  if (pattern === undefined) {
    throw new Error(`Unknown route requested: ${name}`)
  }

  return removePrefix === undefined
    ? pattern
    : pattern.replace(new RegExp(`^${removePrefix.replace('/', '\\/')}`), '')
}
