import { expect, test } from 'vitest'
import markdownToHast from '@innodoc/content-parser'
import { isParserError } from '@innodoc/shared-core/typeguards'
import type { ParserError } from '@innodoc/shared-core/types'
import { serializeParserError } from './utils.js'

/**
 * Error contract of the parser — the shape that decides whether the app's Markdown web worker
 * reports errors or hangs the page forever.
 *
 * // NOTE(silent-hang): `markdownToHast` throws SYNCHRONOUSLY for parse-phase errors: it is
 * `processor.run(processor.parse(markdown))` and the micromark parse rejects inside `parse`.
 * The worker (packages/ui-content/src/hast-listener-middleware/markdown-to-hast-worker.ts,
 * lines 9-20) chains `markdownToHast(content).then(…).catch(…)` — but the throw escapes that
 * expression before `.then`/`.catch` are even attached, so `self.postMessage` (line 16) never
 * runs. On the main thread, `processMarkdown` in hast-listener-middleware.ts has already
 * dispatched `changeIsProcessing(true)` (line 38) and is stuck on
 * `await listenerApi.take(addHastResult.match …)` (line 51); the `finally` block (lines 53-55)
 * that would clear the processing state can only run after that await settles, which never
 * happens. Result: a Markdown syntax error satisfies `isParserError` and serializes to the
 * exact wire shape below, yet the user sees a permanent spinner — no error, no content.
 *
 * Even on the (unreachable for parse errors) async path, the `.catch` handler (worker lines
 * 14-20) only posts a message for errors satisfying `isParserError`; anything else is
 * `console.error`'d with no `postMessage` — the same silent hang.
 *
 * This suite pins all of that as-is (pin, don't fix): if any of it changes, the worker's
 * behavior contract with the main thread has changed.
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

test('the worker-style then/catch chain never observes the parse error (it escapes before the chain is attached)', () => {
  let onFulfilled = 0
  let onRejected = 0
  // Same expression shape as markdown-to-hast-worker.ts line 9: markdownToHast(content).then(…).catch(…)
  expect(() =>
    markdownToHast(unclosedMdx)
      .then(() => onFulfilled++)
      .catch(() => onRejected++),
  ).toThrow(/Unexpected end of file in attribute value/u)
  expect(onFulfilled).toBe(0)
  expect(onRejected).toBe(0)
})
