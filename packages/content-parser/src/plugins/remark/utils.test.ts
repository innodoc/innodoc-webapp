import { mdxMd } from 'micromark-extension-mdx-md'
import { unified } from 'unified'
import { expect, test } from 'vitest'
import remarkGfm from './remark-gfm.js'
import remarkMdx from './remark-mdx.js'
import { addExtension } from './utils.js'

// `remarkMdx` and `remarkGfm` both push into the SAME processor data arrays
// (`micromarkExtensions` / `fromMarkdownExtensions`); if `addExtension` ever
// clobbered instead of accumulating, the second plugin would silently kill the
// first one's syntax.

test('creates the array field when it does not exist yet', () => {
  const data: Record<string, unknown> = {}
  addExtension(data, 'micromarkExtensions', 'ext')
  expect(data.micromarkExtensions).toEqual(['ext'])
})

test('appends to an existing array, preserving insertion order', () => {
  const data: Record<string, unknown> = {}
  addExtension(data, 'micromarkExtensions', 'first')
  addExtension(data, 'micromarkExtensions', 'second')
  expect(data.micromarkExtensions).toEqual(['first', 'second'])
})

test('preserves a pre-existing list and appends after it', () => {
  const data: Record<string, unknown> = { micromarkExtensions: ['existing'] }
  addExtension(data, 'micromarkExtensions', 'new')
  expect(data.micromarkExtensions).toEqual(['existing', 'new'])
})

test('mutates the existing array in place instead of replacing it', () => {
  const list = ['existing']
  const data: Record<string, unknown> = { micromarkExtensions: list }
  addExtension(data, 'micromarkExtensions', 'new')
  expect(data.micromarkExtensions).toBe(list)
  expect(list).toEqual(['existing', 'new'])
})

test('reuses the same array across consecutive additions to a fresh field', () => {
  const data: Record<string, unknown> = {}
  addExtension(data, 'field', 'a')
  const first = data.field
  addExtension(data, 'field', 'b')
  expect(data.field).toBe(first)
  expect(first).toEqual(['a', 'b'])
})

test('keeps different fields independent', () => {
  const data: Record<string, unknown> = {}
  addExtension(data, 'micromarkExtensions', 'a')
  addExtension(data, 'fromMarkdownExtensions', 'b')
  expect(data.micromarkExtensions).toEqual(['a'])
  expect(data.fromMarkdownExtensions).toEqual(['b'])
})

test('replaces a non-array field value with a fresh array', () => {
  const data: Record<string, unknown> = { micromarkExtensions: 'notAnArray' }
  addExtension(data, 'micromarkExtensions', 'ext')
  expect(data.micromarkExtensions).toEqual(['ext'])
})

// Plugin bodies run when the processor freezes (first parse/run, or an
// explicit `.freeze()`), not when `.use()` is called — `data` is still empty
// right after the two `.use` calls.
test('remarkMdx and remarkGfm accumulate on the same processor data without clobbering', () => {
  const p = unified()
  p.use(remarkMdx)
  p.use(remarkGfm)
  expect(p.data('micromarkExtensions')).toBeUndefined()
  p.freeze()
  // remarkMdx contributes 2 micromark + 1 fromMarkdown extension; remarkGfm
  // contributes 2 micromark + 2 fromMarkdown. Both counts must hold, otherwise
  // the second plugin clobbered the first's list.
  const micromarkExtensions = p.data('micromarkExtensions') as unknown[]
  expect(micromarkExtensions).toHaveLength(4)
  // `mdxMd` is registered as a bare value and survived remarkGfm running after it.
  expect(micromarkExtensions).toEqual(expect.arrayContaining([mdxMd]))
  const fromMarkdownExtensions = p.data('fromMarkdownExtensions') as unknown[]
  expect(fromMarkdownExtensions).toHaveLength(3)
})
