import type { ArbitraryObject } from '@innodoc/types/common'

/** Type guard for arbitrary object */
function isArbitraryObject(object: unknown): object is ArbitraryObject {
  return typeof object === 'object' && object !== null
}

/** Type guard for callable */
function isCallable<T extends (...arguments_: unknown[]) => unknown>(object: unknown): object is T {
  return (isArbitraryObject(object) && object instanceof Function) || typeof object === 'function'
}

export { isArbitraryObject, isCallable }
