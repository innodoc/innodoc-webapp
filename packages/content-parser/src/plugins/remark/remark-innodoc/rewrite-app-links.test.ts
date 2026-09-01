import type { Properties } from 'hast'
import type { Link } from 'mdast'
import type { Node } from 'unist'
import { visit } from 'unist-util-visit'
import { expect, test } from 'vitest'
import markdownToHast from '../../../markdown-to-hast.js'
import rewriteAppLinks from './rewrite-app-links.js'

/**
 * T04 — V5 invariant: `app:route|param` specifiers are rewritten to the
 * URL-style `app://` protocol so the `app` protocol can be whitelisted by
 * `rehype-sanitize`, while every other protocol passes through untouched.
 *
 * The `|` separator arrives percent-encoded as `%7C` (micromark encodes it
 * during destination parsing — this package does not encode it itself). The
 * consuming side (`parseLinkSpecifier` in `@innodoc/ui-shared`) decodes `%7C`
 * back to `|` when routing; that cross-package contract is out of scope for
 * this campaign, so the encoded form is what is pinned here.
 */

function makeLink(url: string): Link {
  return { type: 'link', url, children: [] }
}

async function anchorProperties(markdown: string): Promise<Properties[]> {
  const root = await markdownToHast(markdown)
  const found: Properties[] = []
  visit(root, 'element', (el) => {
    if (el.tagName === 'a') {
      found.push(el.properties)
    }
  })
  return found
}

test('rewrites the app: link prefix to the app:// protocol', () => {
  const link = makeLink('app:course:page')
  rewriteAppLinks(link)
  expect(link.url).toBe('app://course:page')
})

test('leaves non-app link urls untouched', () => {
  for (const url of ['mailto:a@b.c', 'https://ex.com', 'http://ex.com', 'javascript:alert(1)', 'foo']) {
    const link = makeLink(url)
    rewriteAppLinks(link)
    expect(link.url).toBe(url)
  }
})

test('ignores nodes that are not links', () => {
  // Nodes that carry a `url` field but are not links — the `isMdastLink`
  // guard must keep the rewrite away from them.
  const paragraph = { type: 'paragraph', url: 'app:should-not-change', children: [] }
  const root = { type: 'root', url: 'app:should-not-change', children: [] }
  rewriteAppLinks(paragraph as Node)
  rewriteAppLinks(root as Node)
  expect(paragraph.url).toBe('app:should-not-change')
  expect(root.url).toBe('app:should-not-change')
})

test('is not idempotent: a second rewrite re-prefixes an already-rewritten url', () => {
  // `app://...` also matches `startsWith('app:')`, so `slice(4)` keeps the
  // existing `//` and the rewrite prefixes another `//` — the slashes double.
  // In practice `remarkInnodoc` visits each node exactly once per parse, so
  // the double rewrite never happens — this pins that the protection is the
  // visit contract, not the function.
  const link = makeLink('app://course:page')
  rewriteAppLinks(link)
  expect(link.url).toBe('app:////course:page')
})

test('rewrites app: specifiers with the | separator encoded as %7C', async () => {
  const properties = await anchorProperties('[go](<app:course:page|p1>)')
  expect(properties).toEqual([{ href: 'app://course:page%7Cp1' }])
})

test('rewrites bare app: specifiers without angle brackets the same way', async () => {
  // A bare destination without `<>` still parses as a link, and micromark
  // percent-encodes the `|` in it as well.
  const properties = await anchorProperties('[go](app:course:page|p1)')
  expect(properties).toEqual([{ href: 'app://course:page%7Cp1' }])
})

test('keeps bare app: specifiers without a separator verbatim after the prefix', async () => {
  const properties = await anchorProperties('[go](app:course:page)')
  expect(properties).toEqual([{ href: 'app://course:page' }])
})

test('leaves mailto: link hrefs untouched end-to-end', async () => {
  const properties = await anchorProperties('[x](mailto:a@b.c)')
  expect(properties).toEqual([{ href: 'mailto:a@b.c' }])
})

test('leaves https: link hrefs untouched end-to-end', async () => {
  const properties = await anchorProperties('[x](https://ex.com)')
  expect(properties).toEqual([{ href: 'https://ex.com' }])
})
