import type { Element, Root as HastRoot } from 'hast'
import type { Table } from 'mdast'
import type { Node as UnistNode } from 'unist'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { expect, it } from 'vitest'
import markdownToHast from '../../markdown-to-hast.js'
import remarkGfm from './remark-gfm.js'

/**
 * Campaign §4.1 — GFM pipe tables now parse.
 *
 * `remark-gfm.ts` registered the `gfmTable` / `gfmTableFromMarkdown` factories
 * uncalled (only `gfmStrikethrough()` was called). A bare factory in
 * `micromarkExtensions` / `fromMarkdownExtensions` is silently ignored, so no
 * table tokens were ever produced and authors saw a pipe table reflowed into a
 * paragraph of literal pipe characters — with no error.
 *
 * Calling the factories (the fix) makes the extension work end to end: a pipe
 * table parses to a real mdast `table` and renders to a hast
 * `table > thead/tbody > tr > th/td`. These tests pin that fixed behavior.
 */

const TABLE = '| a | b |\n| --- | --- |\n| 1 | 2 |'

function tagNames(root: UnistNode): string[] {
  const names: string[] = []
  visit(root, (node) => {
    if (node.type === 'element') {
      names.push((node as Element).tagName)
    }
  })
  return names
}

function elementsOf(root: HastRoot, tag: string): Element[] {
  const els: Element[] = []
  visit(root, 'element', (node) => {
    if (node.tagName === tag) {
      els.push(node)
    }
  })
  return els
}

function textOf(node: UnistNode): string {
  const { value, children } = node as { value?: unknown; children?: UnistNode[] }
  if (typeof value === 'string') {
    return value
  }
  return (children ?? []).map((child) => textOf(child)).join('')
}

it('a gfm pipe table produces a real table node (table > thead/tbody > tr > th/td), not a literal paragraph', async () => {
  const root: HastRoot = await markdownToHast(TABLE)

  // The exact element shape: the root div wraps a single table.
  expect(tagNames(root)).toEqual(['div', 'table', 'thead', 'tr', 'th', 'th', 'tbody', 'tr', 'td', 'td'])

  // Headers and body cells hold the cell text — the pipes are consumed, not kept as text.
  expect(elementsOf(root, 'th').map((el) => textOf(el))).toEqual(['a', 'b'])
  expect(elementsOf(root, 'td').map((el) => textOf(el))).toEqual(['1', '2'])
})

it('an aligned gfm table sets the align property on its cells', async () => {
  const root: HastRoot = await markdownToHast('| a | b |\n|:---|---:|\n| 1 | 2 |')

  expect(tagNames(root)).toEqual(['div', 'table', 'thead', 'tr', 'th', 'th', 'tbody', 'tr', 'td', 'td'])

  const aligns = (tag: string) => elementsOf(root, tag).map((el) => el.properties.align)
  expect(aligns('th')).toEqual(['left', 'right'])
  expect(aligns('td')).toEqual(['left', 'right'])
})

it('a table after a paragraph coexists with the intro paragraph', async () => {
  const root: HastRoot = await markdownToHast(`intro\n\n${TABLE}`)

  expect(tagNames(root)).toEqual(['div', 'p', 'table', 'thead', 'tr', 'th', 'th', 'tbody', 'tr', 'td', 'td'])

  // The intro survives as its own paragraph; the table is its own sibling node.
  expect(textOf(root.children[0] as UnistNode)).toBe('intro')
  expect((root.children[1] as Element).tagName).toBe('table')
})

it('the gfm plugin alone (no MDX, no rehype) parses a real mdast table node', () => {
  // The loss lived in `remark-gfm.ts` registering the table factories uncalled —
  // this minimal processor has no MDX or rehype stage at all, so finding a real
  // table here proves the registration (now calling the factories) is the fix.
  const tree = unified().use(remarkParse).use(remarkGfm).parse(TABLE)

  const table = tree.children[0] as Table
  expect(table.type).toBe('table')
  expect(table.align).toEqual([null, null])

  const rows = table.children
  expect(rows).toHaveLength(2)
  expect(rows.map((row) => row.children.length)).toEqual([2, 2])

  const cellTexts = (cells: readonly UnistNode[]) => cells.map((cell) => textOf(cell))
  expect(cellTexts(rows[0]?.children ?? [])).toEqual(['a', 'b'])
  expect(cellTexts(rows[1]?.children ?? [])).toEqual(['1', '2'])
})
