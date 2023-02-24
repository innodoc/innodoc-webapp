import makeRoutes from '#routes/routes'
import config from '#server/config'

interface ArbitraryObject {
  [key: string]: unknown
}

// TODO remove this or move to cental place?
function isArbitraryObject(obj: unknown): obj is ArbitraryObject {
  return typeof obj === 'object' && obj !== null
}

export function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return isArbitraryObject(error) && error instanceof Error && typeof error.code === 'string'
}

/** Get URL path for route handlers */
export function getRoutePath(name: string, removePrefix?: string) {
  const { routes } = makeRoutes(
    config.courseSlugMode,
    config.pagePathPrefix,
    config.sectionPathPrefix
  )
  const pattern = routes[name]
  if (pattern === undefined) throw new Error(`Unknown route requested: ${name}`)
  return removePrefix === undefined
    ? pattern
    : pattern.replace(new RegExp(`^${removePrefix.replace('/', '\\/')}`), '')
}
