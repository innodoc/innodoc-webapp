/**
 * Position-dependent survival of MDX element properties.
 *
 * The same element keeps different properties depending on where it is written
 * (inline text element → span vs. own line → flow element → div), because the
 * sanitization allowlist is per-tag. Also pins that grid offsets use the
 * camelCase (JSX-legal) spelling and that the kebab-case spelling is stripped.
 */
import type { Element, Properties, Root } from 'hast'
import { visit } from 'unist-util-visit'
import { expect, test } from 'vitest'
import markdownToHast from '@innodoc/content-parser'

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

test('keeps question properties on an inline question element', async () => {
  // Inline MDX elements become spans, and QUESTION_PROPERTIES is allowlisted on span
  const root = await markdownToHast('a <TextQuestion solution="42" points="5">q</TextQuestion> b')
  const questions = collectElements(root).filter((el) => el.tagName === 'span' && el.properties.name === 'TextQuestion')
  expect(questions.map((el) => el.tagName)).toEqual(['span'])
  expect(questions.map((el) => el.properties)).toEqual([{ solution: '42', points: '5', name: 'TextQuestion' }])
})

test('keeps question properties on a question element written on its own line', async () => {
  // Written on its own line, MDX promotes the element to a flow element, so the
  // handler turns it into a div. QUESTION_PROPERTIES is allowlisted on div as well
  // as span, so the question keeps its props regardless of position.
  const root = await markdownToHast('<TextQuestion solution="42" points="5">\n\nwhat is x?\n\n</TextQuestion>')
  const questions = collectElements(root).filter((el) => el.properties.name === 'TextQuestion')
  expect(questions.map((el) => el.tagName)).toEqual(['div'])
  expect(questions.map((el) => el.properties)).toEqual([{ solution: '42', points: '5', name: 'TextQuestion' }])
})

test('strips the non-JSX-legal kebab-case grid offset spelling from grid items', async () => {
  // Kebab-case `xs-offset` is not a legal JSX identifier, so it is no longer
  // allowlisted and is stripped by sanitize. Authors must use camelCase `xsOffset`.
  const root = await markdownToHast('<Grid>\n<GridItem xs="12" xs-offset="2">\n\nhello\n\n</GridItem>\n</Grid>')
  const items = collectElements(root).filter((el) => el.properties.name === 'GridItem')
  expect(items.map((el) => el.properties)).toEqual([{ xs: '12', name: 'GridItem' }])
})

test('keeps the JSX-legal camelCase grid offset spelling on grid items', async () => {
  // MDX attributes are JSX attributes: 'xsOffset' is the JSX-legal, MUI-Grid-native
  // spelling that authors write, so the allowlist whitelists it.
  const root = await markdownToHast('<Grid>\n<GridItem xsOffset="2">\n\nc\n\n</GridItem>\n</Grid>')
  const items = collectElements(root).filter((el) => el.properties.name === 'GridItem')
  expect(items.map((el) => el.properties)).toEqual([{ xsOffset: '2', name: 'GridItem' }])
})

test('keeps xs and the camel offset while dropping the kebab offset on one grid item', async () => {
  const root = await markdownToHast(
    '<Grid>\n<GridItem xs="12" xsOffset="2" xs-offset="4">\n\nm\n\n</GridItem>\n</Grid>',
  )
  const items = collectElements(root).filter((el) => el.properties.name === 'GridItem')
  expect(items.map((el) => el.properties)).toEqual([{ xs: '12', xsOffset: '2', name: 'GridItem' }])
})
