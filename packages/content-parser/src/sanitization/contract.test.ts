/**
 * The self-sufficiency contract of the sanitization schema.
 *
 * The renderer dispatches MDX components by `properties.name` (flow element → div,
 * inline element → span). Those attributes must be guaranteed by the explicit
 * entries in config.ts, not by the upstream `*` fallback: a future upgrade that
 * drops `name` from those defaults must not silently break component dispatch.
 */
import type { Element, Properties, Root } from 'hast'
import { visit } from 'unist-util-visit'
import { expect, test } from 'vitest'
import markdownToHast from '@innodoc/content-parser'
import sanitizationConfig from './config.js'

interface ElementInfo {
  tagName: string
  properties: Properties
}

function collectElements(root: Root): ElementInfo[] {
  const found: ElementInfo[] = []
  visit(root, 'element', (el: Element) => {
    found.push({ tagName: el.tagName, properties: el.properties })
  })
  return found
}

test('the schema grants the dispatch key name on div and span from the app config, not from the upstream * fallback', () => {
  // A plain string entry allows `name` with any value. An array entry would restrict the
  // value, and would not satisfy the dispatch contract, so the assertion must match the
  // string entry specifically (toContain compares array elements, not entry contents).
  expect(sanitizationConfig.attributes?.div).toContain('name')
  expect(sanitizationConfig.attributes?.span).toContain('name')
})

test('the dispatch key name survives the full pipeline on flow and inline MDX elements', async () => {
  const root = await markdownToHast(
    '<Example>\n\nbody\n\n</Example>\n\na <TextQuestion solution="42">q</TextQuestion> b',
  )
  const flow = collectElements(root).filter((el) => el.properties.name === 'Example')
  const inline = collectElements(root).filter((el) => el.properties.name === 'TextQuestion')
  expect(flow.map((el) => el.tagName)).toEqual(['div'])
  expect(inline.map((el) => el.tagName)).toEqual(['span'])
  expect(inline.map((el) => el.properties)).toEqual([{ solution: '42', name: 'TextQuestion' }])
})
