import type { ParserError } from '@innodoc/shared-core/types'

/** Serialize Markdown parser error */
function serializeParserError(error: ParserError) {
  return {
    column: error.column,
    line: error.line,
    reason: error.reason,
    ruleId: error.ruleId,
    source: error.source,
  }
}

export { serializeParserError }
