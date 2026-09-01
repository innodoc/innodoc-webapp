import type { Element, Root } from 'hast'
import { visit } from 'unist-util-visit'
import { expect, test } from 'vitest'
import markdownToHast from '@innodoc/content-parser'

// V7: remark-heading-id ({#custom} syntax, runs in the remark phase) and rehype-slug
// (auto-slugs, runs in the rehype phase, after remark-rehype) coexist in the pipeline,
// and rehype-heading-id-dedupe (plugins/rehype-innodoc/heading-id-dedupe.ts) runs right
// after rehype-slug to de-duplicate the ids the two leave colliding. Observed interplay:
// - a heading with a custom id keeps the EXACT id: it is neither slugified nor
//   re-sanitized (rehype-slug skips any heading that already has `properties.id`)
// - a custom id is never registered in the slugger, so an auto heading whose text
//   slugs to the same string collides with it; the de-dupe pass keeps the FIRST
//   occurrence's exact id in document order and suffixes later occurrences with the
//   slugger's own `-1`/`-2` style, without ever colliding with an id kept elsewhere
// - auto headings de-duplicate among themselves with numeric suffixes (dup, dup-1, dup-2)
// - the slugger and the de-dupe pass both reset per parse, so repeated parses of the
//   same document do not shift each other's ids

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

test('resolves custom/auto id collisions to unique ids, keeping the first occurrence', async () => {
  // rehype-slug skips headings that already have an id, so the custom id is not
  // registered in the slugger and the collision survives to the de-dupe pass:
  // the first heading in document order keeps its exact id, the later one gets a
  // slugger-style numeric suffix. Both orderings resolve the same way.
  const customFirst = await markdownToHast('## Dup {#dup}\n\n## Dup')
  expect(collectHeadings(customFirst).map((el) => el.properties.id)).toEqual(['dup', 'dup-1'])

  const autoFirst = await markdownToHast('## Dup\n\n## Dup {#dup}')
  expect(collectHeadings(autoFirst).map((el) => el.properties.id)).toEqual(['dup', 'dup-1'])
})

test('suffixes every later occurrence in a three-way collision without chained suffixes', async () => {
  // Custom id plus two auto headings that slug to it: the slugger hands the second
  // auto heading `dup-1` BEFORE the pass runs, so when the pass renames the colliding
  // `dup` it must skip the already-kept `dup-1` instead of producing `dup-1-1`.
  const customFirst = await markdownToHast('## Dup {#dup}\n\n## Dup\n\n## Dup')
  expect(collectHeadings(customFirst).map((el) => el.properties.id)).toEqual(['dup', 'dup-2', 'dup-1'])

  const customMiddle = await markdownToHast('## Dup\n\n## Dup {#dup}\n\n## Dup')
  expect(collectHeadings(customMiddle).map((el) => el.properties.id)).toEqual(['dup', 'dup-2', 'dup-1'])
})

test('keeps colliding custom ids unique among themselves', async () => {
  // Two authored `{#x}` on different headings collide too (both survive rehype-slug
  // untouched); the same first-occurrence-keeps rule applies.
  const root = await markdownToHast('## One {#same}\n\n## Two {#same}')
  expect(collectHeadings(root).map((el) => el.properties.id)).toEqual(['same', 'same-1'])
})

test('does not leak heading-id de-duplication state between documents', async () => {
  const doc = '## Dup {#dup}\n\n## Dup'
  const first = await markdownToHast(doc)
  expect(collectHeadings(first).map((el) => el.properties.id)).toEqual(['dup', 'dup-1'])

  // A fresh parse of the same colliding document must not continue where the first
  // left off (no module-level seen-set): the second document still gets dup/dup-1.
  const second = await markdownToHast(doc)
  expect(collectHeadings(second).map((el) => el.properties.id)).toEqual(['dup', 'dup-1'])

  const concurrent = await Promise.all([markdownToHast(doc), markdownToHast(doc)])
  for (const root of concurrent) {
    expect(collectHeadings(root).map((el) => el.properties.id)).toEqual(['dup', 'dup-1'])
  }
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
