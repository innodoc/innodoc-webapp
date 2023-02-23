import routes, { type RouteName } from '#routes'

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
export function getRoutePath(name: RouteName, prefix?: string) {
  const pattern = routes[name]
  if (pattern === undefined) {
    throw new Error(`Unknown route requested: ${name}`)
  }
  if (prefix !== undefined) {
    return pattern.replace(new RegExp(`^${prefix.replace('/', '\\/')}`), '')
  }
  return pattern
}
