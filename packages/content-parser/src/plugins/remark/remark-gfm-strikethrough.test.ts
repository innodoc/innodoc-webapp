/**
 * Campaign §4.2 — GFM strikethrough now parses.
 *
 * `remark-gfm.ts` registered `gfmStrikethroughFromMarkdown` uncalled while its
 * micromark half was called. The called micromark half still consumed the `~~`
 * markers, but the inert fromMarkdown half never built the node, so `~~x~~`
 * rendered as plain `x`. Calling the factory (the fix) makes the extension work:
 * `~~x~~` parses to a mdast `delete` node and renders to a hast `<del>` element.
 * (At these dependency versions the mdast node type is `delete`, not `del`.)
 *
 * These tests pin that fixed behavior.
 */
import type { Element, Root as HastRoot } from 'hast'
import type { Root as MdastRoot } from 'mdast'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { expect, test } from 'vitest'
import markdownToHast from '../../markdown-to-hast.js'
import remarkGfm from './remark-gfm.js'
import remarkMdx from './remark-mdx.js'

function hastTagNames(root: HastRoot): string[] {
  const tags: string[] = []
  visit(root, 'element', (el) => {
    tags.push(el.tagName)
  })
  return tags
}

function hastTexts(root: HastRoot): string[] {
  const texts: string[] = []
  visit(root, 'text', (node) => {
    texts.push(node.value)
  })
  return texts
}

function mdastNodeTypes(tree: MdastRoot): string[] {
  const types: string[] = []
  visit(tree, (node) => {
    types.push(node.type)
  })
  return types
}

test('~~x~~ produces a del element wrapping the struck text', async () => {
  const root = await markdownToHast('~~x~~')
  expect(hastTagNames(root)).toEqual(['div', 'p', 'del'])
  expect(hastTexts(root)).toEqual(['x'])
})

test('a ~~b~~ c keeps its surrounding text runs alongside the del', async () => {
  const root = await markdownToHast('a ~~b~~ c')
  expect(hastTagNames(root)).toEqual(['div', 'p', 'del'])
  // The paragraph holds two text runs bracketing the del — the runs no longer merge.
  expect(hastTexts(root)).toEqual(['a ', 'b', ' c'])
})

test('tildes not word-delimited (a~~b~~c) still produce a del', async () => {
  const root = await markdownToHast('a~~b~~c')
  expect(hastTagNames(root)).toEqual(['div', 'p', 'del'])
  expect(hastTexts(root)).toEqual(['a', 'b', 'c'])
})

test('~~~hard~~~ stays a tilde-fenced code block, not a strikethrough', async () => {
  // Tilde-fence precedence wins over strikethrough; pin the code block shape so a
  // regression in either direction (a `del` leaking in, or the fence losing) trips.
  const root = await markdownToHast('~~~hard~~~')
  const tags = hastTagNames(root)
  expect(tags).toEqual(['div', 'pre', 'code'])
  expect(tags).not.toContain('del')
  const codeElements: Element[] = []
  visit(root, 'element', (el) => {
    if (el.tagName === 'code') {
      codeElements.push(el)
    }
  })
  expect(codeElements[0]?.properties.className).toEqual(['language-hard~~~'])
  expect(hastTexts(root)).toEqual([''])
})

test('the gfm plugin alone (no MDX) produces the delete node', () => {
  const tree = unified().use(remarkParse).use(remarkGfm).parse('~~x~~')
  expect(mdastNodeTypes(tree)).toEqual(['root', 'paragraph', 'delete', 'text'])
})

test('MDX is not implicated — mdx+gfm yields the identical mdast shape as gfm alone', () => {
  const gfm = unified().use(remarkParse).use(remarkGfm).parse('~~x~~')
  const mdxGfm = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).parse('~~x~~')
  expect(mdastNodeTypes(mdxGfm)).toEqual(mdastNodeTypes(gfm))
  expect(mdastNodeTypes(mdxGfm)).toEqual(['root', 'paragraph', 'delete', 'text'])
})
