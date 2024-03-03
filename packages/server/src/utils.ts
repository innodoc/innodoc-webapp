import path from 'node:path'

import config from '@innodoc/config'
import getRouteManager from '@innodoc/routes/node/getRouteManager'
import { isArbitraryObject } from '@innodoc/utils/typeGuards'
import type { ApiRouteName } from '@innodoc/routes/types'

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return isArbitraryObject(error) && error instanceof Error && typeof error.code === 'string'
}

/**
 * Get URL path for API route handler.
 *
 * @param name Name of the API route
 * @param removePrefix Optional route path prefix to strip
 * @returns Route path
 * @throws if unknown route name was given
 */
function getRoutePath(name: ApiRouteName, removePrefix?: string) {
  const apiRoutes = getRouteManager(config).getApiRoutes()

  const pattern = apiRoutes[name]
  if (pattern === undefined) {
    throw new Error(`Unknown route requested: ${name}`)
  }

  return removePrefix === undefined
    ? pattern
    : pattern.replace(new RegExp(`^${removePrefix.replace('/', '\\/')}`), '')
}

/**
 * Get server package path.
 *
 * @returns path to server package
 */
function getServerPath() {
  return path.join(config.rootDir, 'packages', 'server')
}

export { getRoutePath, getServerPath, isErrnoException }
