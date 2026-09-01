/**
 * Position-dependent survival of MDX element properties.
 *
 * The same element keeps different properties depending on where it is written
 * (inline text element → span vs. own line → flow element → div), because the
 * sanitization allowlist is per-tag. Also pins the kebab-vs-camel spelling
 * mismatch in the grid offset allowlist.
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

test('FIXME(parser-loss): a question element on its own line loses all question properties', async () => {
  // Written on its own line, MDX promotes the element to a flow element, so the
  // handler turns it into a div. QUESTION_PROPERTIES is only allowlisted on span,
  // so sanitize strips solution/points/validation from the div — no error is raised.
  // Author-visible result: a question with no solution, points or validation.
  // ui-content's flowDivComponentMap has no TextQuestion entry, so the div renders
  // as a bare <div> anyway.
  const root = await markdownToHast('<TextQuestion solution="42" points="5">\n\nwhat is x?\n\n</TextQuestion>')
  const questions = collectElements(root).filter((el) => el.properties.name === 'TextQuestion')
  expect(questions.map((el) => el.tagName)).toEqual(['div'])
  expect(questions.map((el) => el.properties)).toEqual([{ name: 'TextQuestion' }])
})

test('keeps the kebab-case grid offset spelling on grid items', async () => {
  const root = await markdownToHast('<Grid>\n<GridItem xs="12" xs-offset="2">\n\nhello\n\n</GridItem>\n</Grid>')
  const items = collectElements(root).filter((el) => el.properties.name === 'GridItem')
  expect(items.map((el) => el.properties)).toEqual([{ xs: '12', 'xs-offset': '2', name: 'GridItem' }])
})

test('FIXME(parser-loss): the JSX-legal camelCase grid prop xsOffset is silently dropped', async () => {
  // MDX attributes are JSX attributes: 'xs-offset' is not a legal JSX identifier
  // (it only parses because mdast-util-mdx-jsx accepts the HTML-ish form), so an
  // author writing JSX-native syntax writes 'xsOffset'. 'videoId' in
  // YOUTUBE_VIDEO_PROPERTIES is camelCase and is the only allowlisted custom prop
  // with a live consumer, and MUI Grid item props are camelCase (xsOffset). The
  // allowlist's five *-offset entries are v1 leftovers in the wrong spelling — the
  // spelling authors will actually write is the one the sanitizer discards.
  const root = await markdownToHast('<Grid>\n<GridItem xsOffset="2">\n\nc\n\n</GridItem>\n</Grid>')
  const items = collectElements(root).filter((el) => el.properties.name === 'GridItem')
  expect(items.map((el) => el.properties)).toEqual([{ name: 'GridItem' }])
})

test('keeps xs and the kebab offset while dropping the camel offset on one grid item', async () => {
  const root = await markdownToHast(
    '<Grid>\n<GridItem xs="12" xsOffset="2" xs-offset="4">\n\nm\n\n</GridItem>\n</Grid>',
  )
  const items = collectElements(root).filter((el) => el.properties.name === 'GridItem')
  expect(items.map((el) => el.properties)).toEqual([{ xs: '12', 'xs-offset': '4', name: 'GridItem' }])
})
