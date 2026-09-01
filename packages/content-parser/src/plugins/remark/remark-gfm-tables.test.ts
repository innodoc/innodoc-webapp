import type { Element, Root as HastRoot } from 'hast'
import type { Paragraph, Table } from 'mdast'
import type { Node as UnistNode } from 'unist'
import { gfmTableFromMarkdown } from 'mdast-util-gfm-table'
import { gfmTable } from 'micromark-extension-gfm-table'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { expect, it } from 'vitest'
import markdownToHast from '../../markdown-to-hast.js'
import remarkGfm from './remark-gfm.js'

/**
 * Campaign §4.1 — GFM pipe tables do not parse.
 *
 * An author writes a pipe table and gets back a paragraph of literal pipe
 * characters, with no error: silent content loss. `ui-content` already maps
 * table elements (`components-map.ts`; the table renderer was added in
 * e1b31c35) — it is simply fed nothing.
 *
 * These tests pin the CURRENT (wrong) behavior on purpose, so that any change
 * to the loss — a fix OR a further degradation — trips the suite.
 *
 * Localization (established empirically against the installed extensions):
 * the loss is NOT an MDX/rehype interaction and NOT the `addExtension`
 * wrapper. A minimal `remarkParse` + local `remarkGfm` processor (no MDX at
 * all) already produces no table node, while a minimal processor that calls
 * the same extension factories DOES parse a table. `remark-gfm.ts` registers
 * the `gfmTable` and `gfmTableFromMarkdown` factories uncalled (only
 * `gfmStrikethrough()` is called); micromark silently ignores a bare factory
 * function in `micromarkExtensions`, so no table tokens are ever produced.
 * That suspected root cause is unpinned by design of the tests-only campaign.
 */

const TABLE = '| a | b |\n| --- | --- |\n| 1 | 2 |'
const TABLE_TAGS = new Set(['caption', 'table', 'tbody', 'td', 'th', 'thead', 'tr'])

function tagNames(root: UnistNode): string[] {
  const names: string[] = []
  visit(root, (node) => {
    if (node.type === 'element') {
      names.push((node as Element).tagName)
    }
  })
  return names
}

function textOf(node: UnistNode): string {
  const { value, children } = node as { value?: unknown; children?: UnistNode[] }
  if (typeof value === 'string') {
    return value
  }
  return (children ?? []).map((child) => textOf(child)).join('')
}

it('FIXME(parser-loss): a gfm pipe table degrades to a literal-text paragraph, with no table node anywhere', async () => {
  // Campaign §4.1: the table becomes a plain paragraph of pipe characters.
  // `ui-content` has a working table renderer (e1b31c35) that is fed nothing,
  // so authors see their table reflowed into a wall of text — with no error.
  const root: HastRoot = await markdownToHast(TABLE)

  // No table/thead/tbody/tr/th/td/caption node survives anywhere in the tree.
  expect(tagNames(root).some((tag) => TABLE_TAGS.has(tag))).toBe(false)
  expect(tagNames(root)).toEqual(['div', 'p'])

  // The content degrades to literal text: the paragraph keeps the pipes.
  expect(textOf(root)).toContain('| a | b |')
  expect(textOf(root)).toContain('| --- | --- |')
  expect(textOf(root)).toContain('1 | 2')
})

it('FIXME(parser-loss): an aligned gfm table degrades the same way', async () => {
  const root: HastRoot = await markdownToHast('| a | b |\n|:---|---:|\n| 1 | 2 |')

  expect(tagNames(root).some((tag) => TABLE_TAGS.has(tag))).toBe(false)
  expect(tagNames(root)).toEqual(['div', 'p'])
  expect(textOf(root)).toContain('|:---|---:|')
})

it('FIXME(parser-loss): a table after a paragraph degrades to a second paragraph', async () => {
  const root: HastRoot = await markdownToHast(`intro\n\n${TABLE}`)

  // The intro survives as its own paragraph; the table becomes a second
  // paragraph of literal pipe text.
  expect(tagNames(root).some((tag) => TABLE_TAGS.has(tag))).toBe(false)
  expect(tagNames(root)).toEqual(['div', 'p', 'p'])
  expect(root.children.map((child) => textOf(child))).toEqual(['intro', TABLE])
})

it('localizes the loss: the gfm plugin alone, without MDX, also produces no table node', () => {
  // The campaign doc suspected an MDX-vs-GFM interaction. It is ruled out:
  // this minimal processor has no MDX and no rehype stage at all, yet the
  // table is already lost. The loss is registered by `remark-gfm.ts` itself.
  //
  // (unified runs a function plugin when the processor freezes on the first
  // parse, so `parse` below is what triggers the extension registration.)
  const processor = unified().use(remarkParse).use(remarkGfm)
  const tree = processor.parse(TABLE)

  const types: string[] = []
  visit(tree, (node) => {
    types.push(node.type)
  })

  expect(types).not.toContain('table')
  expect((tree.children[0] as Paragraph).type).toBe('paragraph')
  expect(textOf(tree.children[0] as UnistNode)).toBe(TABLE)
})

it('control: the same table extension parses a table when its factories are called', () => {
  // Suspected root cause, unpinned by design of the tests-only campaign:
  // `remark-gfm.ts` passes the `gfmTable` / `gfmTableFromMarkdown` factories
  // into `micromarkExtensions` / `fromMarkdownExtensions` UNCALLEED (only
  // `gfmStrikethrough()` is called). A bare factory function is silently
  // ignored as an extension, so the micromark half never tokenizes the table
  // (contrast §4.2 strikethrough, whose called micromark half still consumes
  // the `~~` markers). With the factories called, the installed extensions
  // work — so the loss is in the registration, not in the extension or in
  // any downstream stage.
  const processor = unified()
    .use(remarkParse)
    .data('micromarkExtensions', [gfmTable()])
    .data('fromMarkdownExtensions', [gfmTableFromMarkdown()])
  const tree = processor.parse(TABLE)

  const types: string[] = []
  visit(tree, (node) => {
    types.push(node.type)
  })
  expect(types).toContain('table')

  const table = tree.children[0] as Table
  expect(table.type).toBe('table')
  expect(table.align).toEqual([null, null])
  const rows = table.children
  expect(rows).toHaveLength(2)
  expect(rows.map((row) => row.children.length)).toEqual([2, 2])
})
