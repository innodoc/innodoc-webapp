import { COURSE_SLUG_MODES } from '#constants'
import type { ArbitraryObject, CourseSlugMode } from '#types'

/** Type guard for arbitrary object */
function isArbitraryObject(object: unknown): object is ArbitraryObject {
  return typeof object === 'object' && object !== null
}

/** Type guard for `CourseSlugMode` */
function isCourseSlugMode(thing: unknown): thing is CourseSlugMode {
  return typeof thing === 'string' && COURSE_SLUG_MODES.includes(thing as CourseSlugMode)
}

/** Utility function to be used as exhaustion check. */
function assertNever(value: never): never {
  // oxlint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error(`This code should never be reached. Value='${value}'`)
}

export { assertNever, isArbitraryObject, isCourseSlugMode }
