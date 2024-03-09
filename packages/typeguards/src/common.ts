import isLocaleValidator from 'validator/lib/isLocale'
import type { LanguageCode } from 'iso-639-1'

import type { ArbitraryObject } from '@innodoc/types/common'

/** Type guard for arbitrary object */
function isArbitraryObject(object: unknown): object is ArbitraryObject {
  return typeof object === 'object' && object !== null
}

/** Type guard for callable */
function isCallable<T extends (...arguments_: unknown[]) => unknown>(object: unknown): object is T {
  return (isArbitraryObject(object) && object instanceof Function) || typeof object === 'function'
}

/** Type guard for `Locale` */
function isLocale(thing: unknown): thing is LanguageCode {
  return typeof thing === 'string' && isLocaleValidator(thing)
}

export { isArbitraryObject, isCallable, isLocale }
