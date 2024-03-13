/** Markdown parser error */
interface ParserError {
  column: number
  line: number
  reason: string
  ruleId: string
  source: string
}

export type { ParserError }
