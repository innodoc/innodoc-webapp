import type { Element, Root } from 'hast'
import { visit } from 'unist-util-visit'
import { expect, test } from 'vitest'
import markdownToHast from '@innodoc/content-parser'

// V7: remark-heading-id ({#custom} syntax, runs in the remark phase) and rehype-slug
// (auto-slugs, runs in the rehype phase, after remark-rehype) coexist in the pipeline.
// Observed interplay, pinned here:
// - a heading with a custom id keeps the EXACT id: it is neither slugified nor
//   de-duplicated (rehype-slug skips any heading that already has `properties.id`)
// - a custom id is never registered in the slugger, so a later auto heading whose
//   text slugs to the same string produces a DUPLICATE id (both spellings stay)
// - auto headings de-duplicate among themselves with numeric suffixes (dup, dup-1, dup-2)
// - the slugger is module-level but reset at the start of each transform, so repeated
//   parses of the same document do not shift each other's slugs

function collectHeadings(root: Root): Element[] {
  const found: Element[] = []
  visit(root, 'element', (el) => {
    if (/^h[1-6]$/u.test(el.tagName)) {
      found.push(el)
    }
  })
  return found
}

test('keeps the exact custom id from {#id} on the heading, unslugified', async () => {
  const root = await markdownToHast('## Title {#custom}')
  const headings = collectHeadings(root)
  expect(headings.map((el) => el.tagName)).toEqual(['h2'])
  expect(headings.map((el) => el.properties.id)).toEqual(['custom'])

  const weird = await markdownToHast('## T {#Weird-Id_1}')
  expect(collectHeadings(weird).map((el) => el.properties.id)).toEqual(['Weird-Id_1'])
})

test('slugifies headings without a custom id', async () => {
  const root = await markdownToHast('### Auto Heading')
  const headings = collectHeadings(root)
  expect(headings.map((el) => el.tagName)).toEqual(['h3'])
  expect(headings.map((el) => el.properties.id)).toEqual(['auto-heading'])

  const upper = await markdownToHast('## HELLO WORLD')
  expect(collectHeadings(upper).map((el) => el.properties.id)).toEqual(['hello-world'])
})

test('de-duplicates repeated auto headings with numeric suffixes', async () => {
  const two = await markdownToHast('## Dup\n\n## Dup')
  expect(collectHeadings(two).map((el) => el.properties.id)).toEqual(['dup', 'dup-1'])

  const three = await markdownToHast('## Dup\n\n## Dup\n\n## Dup')
  expect(collectHeadings(three).map((el) => el.properties.id)).toEqual(['dup', 'dup-1', 'dup-2'])
})

test('produces duplicate ids when a custom id collides with an auto slug', async () => {
  // rehype-slug skips headings that already have an id, so the custom id is not
  // registered in the slugger and the auto heading does not avoid it
  const customFirst = await markdownToHast('## Dup {#dup}\n\n## Dup')
  expect(collectHeadings(customFirst).map((el) => el.properties.id)).toEqual(['dup', 'dup'])

  const autoFirst = await markdownToHast('## Dup\n\n## Dup {#dup}')
  expect(collectHeadings(autoFirst).map((el) => el.properties.id)).toEqual(['dup', 'dup'])
})

test('maps heading levels one through six to h1 through h6', async () => {
  const markdown = ['# H1', '## H2', '### H3', '#### H4', '##### H5', '###### H6'].join('\n\n')
  const root = await markdownToHast(markdown)
  expect(collectHeadings(root).map((el) => el.tagName)).toEqual(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
})

test('slugifies setext headings like ATX headings', async () => {
  const root = await markdownToHast('Title\n=====')
  const headings = collectHeadings(root)
  expect(headings.map((el) => el.tagName)).toEqual(['h1'])
  expect(headings.map((el) => el.properties.id)).toEqual(['title'])
})

test('does not leak slug counters between documents', async () => {
  const first = await markdownToHast('## Dup\n\n## Dup')
  expect(collectHeadings(first).map((el) => el.properties.id)).toEqual(['dup', 'dup-1'])

  const second = await markdownToHast('## Dup\n\n## Dup')
  expect(collectHeadings(second).map((el) => el.properties.id)).toEqual(['dup', 'dup-1'])
})
