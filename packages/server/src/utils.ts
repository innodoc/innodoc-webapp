import type { ApiRouteName } from '@innodoc/routes/types'
import type { NextFunction } from 'express'

import getRouteManager from '@innodoc/routes/node/getRouteManager'
import { isArbitraryObject } from '@innodoc/utils/type-guards'

import config from './config'

export function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return isArbitraryObject(error) && error instanceof Error && typeof error.code === 'string'
}

/** Get URL path for API route handlers */
export function getRoutePath(name: ApiRouteName, removePrefix?: string) {
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
 *  Workaround for Express typing issues
 *  https://github.com/standard/eslint-config-standard-with-typescript/issues/613#issuecomment-1082960337
 */
export function asyncWrapper(asyncFn: (req: Request, res: Response) => Promise<void>) {
  return function (req: Request, res: Response, next: NextFunction) {
    // eslint-disable-next-line promise/no-callback-in-promise
    asyncFn(req, res).catch(next)
  }
}
