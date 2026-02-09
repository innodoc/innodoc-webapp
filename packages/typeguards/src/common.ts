import isLocaleValidator from 'validator/lib/isLocale.js'
import type { LanguageCode } from 'iso-639-1'

import { COURSE_SLUG_MODES } from '@innodoc/constants'
import type { ArbitraryObject, CourseSlugMode } from '@innodoc/types/common'

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

/** Type guard for `CourseSlugMode` */
function isCourseSlugMode(thing: unknown): thing is CourseSlugMode {
  return typeof thing === 'string' && COURSE_SLUG_MODES.includes(thing as CourseSlugMode)
}

export { isArbitraryObject, isCallable, isCourseSlugMode, isLocale }
