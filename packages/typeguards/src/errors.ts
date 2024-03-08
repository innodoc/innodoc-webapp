import type { ParserError } from '@innodoc/types/errors'

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

export { isErrorWithMessage, isParserError }
