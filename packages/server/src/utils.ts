import { isNativeError } from 'node:util/types'

import type { NextFunction, Request, Response } from 'express'

import getRouteManager from '@innodoc/routes/node/getRouteManager'
import { isArbitraryObject } from '@innodoc/utils/typeGuards'
import type { ApiRouteName } from '@innodoc/routes/types'

import config from './config'

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return isArbitraryObject(error) && error instanceof Error && typeof error.code === 'string'
}

/** Get URL path for API route handlers */
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
 *  Workaround for Express typing issues
 *  https://github.com/standard/eslint-config-standard-with-typescript/issues/613#issuecomment-1082960337
 */
function asyncWrapper(asyncFn: (req: Request, res: Response) => Promise<void>) {
  return function (req: Request, res: Response, next: NextFunction) {
    asyncFn(req, res).catch((err) => {
      if (isNativeError(err)) {
        setImmediate<[Error]>(next, err)
      }
    })
  }
}

export { asyncWrapper, getRoutePath, isErrnoException }
