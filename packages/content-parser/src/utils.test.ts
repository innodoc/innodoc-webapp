import { expect, test } from 'vitest'
import markdownToHast from '@innodoc/content-parser'
import { isParserError } from '@innodoc/shared-core/typeguards'
import type { ParserError } from '@innodoc/shared-core/types'
import { serializeParserError } from './utils.js'

/**
 * Error contract of the parser — the shape that decides what the app's Markdown web worker posts
 * when a document fails to parse.
 *
 * `markdownToHast` throws SYNCHRONOUSLY for parse-phase errors: it is
 * `processor.run(processor.parse(markdown))` and the micromark parse rejects inside `parse`,
 * before the returned promise exists. The worker
 * (packages/ui-content/src/hast-listener-middleware/markdown-to-hast-worker.ts) therefore wraps
 * the call in `try { await markdownToHast(…) } catch { … }` so both the synchronous parse throw
 * and any async (transform-phase) rejection flow through one error branch that always posts a
 * wire-shaped result. The worker-level behavior is pinned by the tests next to the worker module
 * itself.
 *
 * This suite pins the parser-side facts that fix relies on: the synchronous throw, the
 * `isParserError`-satisfying diagnostics, and the exact wire shape the worker posts.
 */

const unclosedMdx = '<Info title="unclosed>'

test('serializeParserError returns exactly the five wire fields, dropping everything else', () => {
  // A real parser error carries more than the wire shape (e.g. `message`, `stack`, `place`) —
  // the serializer must drop everything but the five fields the store consumes.
  const error = {
    column: 23,
    line: 1,
    reason: 'Unexpected end of file in attribute value',
    ruleId: 'unexpected-eof',
    source: 'micromark-extension-mdx-jsx',
    message: '1:23 Unexpected end of file in attribute value',
    stack: 'Error: 1:23 Unexpected end of file in attribute value',
  }
  expect(serializeParserError(error as ParserError)).toStrictEqual({
    column: 23,
    line: 1,
    reason: 'Unexpected end of file in attribute value',
    ruleId: 'unexpected-eof',
    source: 'micromark-extension-mdx-jsx',
  })
})

test('an unclosed MDX attribute quote throws synchronously when markdownToHast is called', () => {
  // `toThrow` only passes for a synchronous throw: if markdownToHast ever returned a rejected
  // promise instead, the call expression would not throw and this test would fail.
  expect(() => markdownToHast(unclosedMdx)).toThrow(/Unexpected end of file in attribute value/u)
})

function capturedParseError(): ParserError {
  let caught: unknown
  try {
    void markdownToHast(unclosedMdx)
    caught = new Error('markdownToHast did not throw synchronously for an unclosed attribute value')
  } catch (error) {
    caught = error
  }
  if (!isParserError(caught)) {
    throw new Error('the thrown value does not satisfy isParserError')
  }
  return caught
}

test('the synchronously thrown parse error satisfies isParserError with the mdx-jsx diagnostics', () => {
  const error = capturedParseError()
  expect(error.reason).toContain('Unexpected end of file in attribute value')
  expect(error.line).toBe(1)
  expect(error.column).toBe(23)
  expect(error.source).toBe('micromark-extension-mdx-jsx')
  expect(error.ruleId).toBe('unexpected-eof')
})

test('serializeParserError of the thrown error yields the exact wire object the worker posts', () => {
  expect(serializeParserError(capturedParseError())).toStrictEqual({
    column: 23,
    line: 1,
    reason: 'Unexpected end of file in attribute value, expected a corresponding closing quote `"`',
    ruleId: 'unexpected-eof',
    source: 'micromark-extension-mdx-jsx',
  })
})

test('the worker-style try/await/catch observes the parse error (the pattern markdown-to-hast-worker.ts uses)', async () => {
  let caught: unknown
  // Same pattern as markdown-to-hast-worker.ts: the call sits inside a try block, so the
  // synchronous parse throw is caught here exactly as it is in the worker.
  try {
    await markdownToHast(unclosedMdx)
  } catch (error) {
    caught = error
  }
  expect(caught).toBeDefined()
  expect(caught).toBeInstanceOf(Error)
  // The worker's error branch keys on this guard before serializing; the thrown value must satisfy it.
  expect(isParserError(caught)).toBe(true)
})
