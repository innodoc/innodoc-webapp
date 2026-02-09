import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import container from '@innodoc/container'
import { isArbitraryObject } from '@innodoc/typeguards/common'
import type { ApiRouteName } from '@innodoc/routes/types/routeNames'

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
  const routeManager = container.resolve('routeManager')
  const apiRoutes = routeManager.getApiRoutes()

  const pattern = apiRoutes[name]
  if (pattern === undefined) {
    throw new Error(`Unknown route requested: ${name}`)
  }

  return removePrefix === undefined ? pattern : pattern.replace(new RegExp(`^${removePrefix.replace('/', '\\/')}`), '')
}

/**
 * Get server package `rootDir` path.
 *
 * @returns path to server package source
 */
function getRootDirPath() {
  return path.dirname(fileURLToPath(import.meta.url))
}

/**
 * Get dev server certificates.
 *
 * @returns object containing certificates
 */
async function devCerts() {
  const certPath = path.resolve(getRootDirPath(), '..', 'cert')
  return {
    https: {
      allowHTTP1: true,
      key: await fs.readFile(path.join(certPath, 'key.pem')),
      cert: await fs.readFile(path.join(certPath, 'cert.pem')),
    },
  }
}

export { devCerts, getRootDirPath, getRoutePath, isErrnoException }
