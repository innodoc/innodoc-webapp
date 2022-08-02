type ArbitraryObject = { [key: string]: unknown }

function isArbitraryObject(potentialObject: unknown): potentialObject is ArbitraryObject {
  return typeof potentialObject === 'object' && potentialObject !== null
}

export function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return isArbitraryObject(error) && error instanceof Error && typeof error.code === 'string'
}
