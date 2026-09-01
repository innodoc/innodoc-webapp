/**
 * Campaign §4.2 — GFM strikethrough does not parse (pin + find).
 *
 * `~~x~~` renders as plain `x`: the `~~` markers are *consumed* (the
 * micromark extension tokenizes, so authors never see literal tildes in the
 * output — the distinctive tell vs the table loss, where the markers stay
 * visible as text), but the mdast `delete` node is never built, so no `del`
 * element exists in the hast tree.
 *
 * These tests deliberately pin that loss: they stay green while the bug
 * persists and trip on either a fix (a `del` appears) or further
 * degradation (e.g. markers no longer consumed).
 *
 * Localized (observed, not fixed): `remark-gfm.ts` registers
 * `gfmStrikethroughFromMarkdown` — a *factory function* — into
 * `fromMarkdownExtensions` without calling it, while the micromark side is
 * called (`gfmStrikethrough()`). `mdast-util-from-markdown` reads no
 * `enter`/`exit` handlers from a bare function, so the `strikethrough`
 * token is skipped and only its child text survives. `gfmTableFromMarkdown`
 * is a factory as well — the parallel table loss is pinned by the table
 * test file, not here.
 */
import type { Element, Root as HastRoot } from 'hast'
import type { Root as MdastRoot } from 'mdast'
import { gfmStrikethroughFromMarkdown } from 'mdast-util-gfm-strikethrough'
import { gfmStrikethrough } from 'micromark-extension-gfm-strikethrough'
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

test('FIXME(parser-loss): ~~x~~ renders as plain text — markers consumed, no del node built (§4.2)', async () => {
  // FIXME(parser-loss): the tildes are consumed (text is 'x', never '~~x~~')
  // yet no del element is built; the prompt survives as unmarked text.
  const root = await markdownToHast('~~x~~')
  expect(hastTagNames(root)).toEqual(['div', 'p'])
  expect(hastTagNames(root)).not.toContain('del')
  expect(hastTagNames(root)).not.toContain('s')
  expect(hastTexts(root)).toEqual(['x'])
})

test('FIXME(parser-loss): a ~~b~~ c keeps no del — surviving text runs merge into one text node', async () => {
  const root = await markdownToHast('a ~~b~~ c')
  expect(hastTagNames(root)).toEqual(['div', 'p'])
  expect(hastTagNames(root)).not.toContain('del')
  // from-markdown merges the surviving runs; 'b' is plain text, no wrapper
  expect(hastTexts(root)).toEqual(['a b c'])
})

test('FIXME(parser-loss): tildes are consumed even when not word-delimited (a~~b~~c)', async () => {
  const root = await markdownToHast('a~~b~~c')
  expect(hastTagNames(root)).toEqual(['div', 'p'])
  expect(hastTagNames(root)).not.toContain('del')
  expect(hastTexts(root)).toEqual(['abc'])
})

test('FIXME(parser-loss): ~~~hard~~~ is swallowed by the tilde-fence parser, not by strikethrough', async () => {
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

test('localization: the gfm plugin alone (no MDX) already loses the delete node', () => {
  const tree = unified().use(remarkParse).use(remarkGfm).parse('~~x~~')
  const types = mdastNodeTypes(tree)
  expect(types).toEqual(['root', 'paragraph', 'text'])
  expect(types).not.toContain('delete')
  // the micromark half fires (tilde consumed — without it the text would be
  // '~~x~~'); the fromMarkdown half is the inert one
})

test('localization: MDX registration is not implicated — mdx+gfm yields the identical mdast shape', () => {
  const tree = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).parse('~~x~~')
  const types = mdastNodeTypes(tree)
  expect(types).toEqual(['root', 'paragraph', 'text'])
  expect(types).not.toContain('delete')
  // the loss predates any MDX interaction: it lives in remark-gfm.ts itself
})

test('localization: calling the factory registers the extension — a delete node appears (root cause, informational only)', () => {
  const tree = unified()
    .use(remarkParse)
    .data('micromarkExtensions', [gfmStrikethrough()])
    .data('fromMarkdownExtensions', [gfmStrikethroughFromMarkdown()])
    .parse('~~x~~')
  expect(mdastNodeTypes(tree)).toEqual(['root', 'paragraph', 'delete', 'text'])
  // the one-line difference: remark-gfm.ts passes gfmStrikethroughFromMarkdown
  // itself instead of gfmStrikethroughFromMarkdown(). Tests-only campaign: not fixed here.
})
