import routes, { type RoutesDefinition } from '#routes'

type ArbitraryObject = { [key: string]: unknown }

function isArbitraryObject(potentialObject: unknown): potentialObject is ArbitraryObject {
  return typeof potentialObject === 'object' && potentialObject !== null
}

export function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return isArbitraryObject(error) && error instanceof Error && typeof error.code === 'string'
}

/** Get URL path for route handlers */
export function getRoutePath(name: keyof RoutesDefinition, prefix?: string) {
  const pattern = routes[name]
  if (pattern === undefined) {
    throw new Error(`Unknown route requested: ${name}`)
  }
  if (prefix !== undefined) {
    return pattern.replace(new RegExp(`^${prefix.replace('/', '\\/')}`), '')
  }
  return pattern
}
