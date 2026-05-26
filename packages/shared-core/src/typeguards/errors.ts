import type { ZodError } from 'zod'
import type { ParserError } from '#types'
import { isArbitraryObject } from './common.js'

/** Type guard for error object */
function isParserError(object: unknown): object is ParserError {
  return (
    isArbitraryObject(object) &&
    typeof object.reason === 'string' &&
    typeof object.line === 'number' &&
    typeof object.column === 'number' &&
    typeof object.source === 'string' &&
    typeof object.ruleId === 'string'
  )
}

/** Type guard for object with a string `message` property */
function isErrorWithMessage(error: unknown): error is { message: string } {
  return isArbitraryObject(error) && 'message' in error && typeof (error as { message: string }).message === 'string'
}

/** Type guard for `ZodError` */
function isZodError(error: unknown): error is ZodError {
  return isArbitraryObject(error) && 'issues' in error && Array.isArray(error.issues)
}

export { isErrorWithMessage, isParserError, isZodError }
