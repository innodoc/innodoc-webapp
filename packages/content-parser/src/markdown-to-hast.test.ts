/**
 * Contract test for the full `markdownToHast` pipeline: one realistic author document parsed
 * through every plugin, pinning the observable tree shape — and the stage order that shape
 * proves:
 *
 * - mdast phase (`remarkParse` + `remarkMdx` + `remarkGfm` + `remarkMath`): ATX headings,
 *   emphasis, inline code, links and `$math$` tokenize; `remarkHeadingId` applies `{#id}`
 * - `remarkRehype` handlers: the `root` handler wraps everything in a `div` marked
 *   `root: 'true'`; the `mdxJsxFlowElement` handler turns JSX elements into `div`s carrying
 *   their string attributes plus a `type: 'mdxJsxFlowElement'` marker
 * - `rehypeSlug`: auto-generates heading ids (e.g. `section-heading`)
 * - `rehypeInnodoc`: `Tabs` collects `labels`, `TabItem`s get a string `index`
 * - `rehypeSanitize`: strips the `type` marker (not allowlisted), keeps the allowlisted
 *   `root`/`labels`/`index` — and once stripped `root` entirely (886dd19b, pinned below)
 * - `rehypeKatex`: runs **after** sanitization, so its `className`/`ariaHidden` markup —
 *   absent from every allowlist — still reaches the output
 *
 * The document deliberately excludes GFM pipe tables, `~~strikethrough~~`, `<Table caption>`,
 * block-level `TextQuestion` with question props and camelCase grid props: those behaviors
 * are pinned by their own tests, and some of them are known parser losses this golden tree
 * must not bake in.
 */
import type { Element, Text } from 'hast'
import type { Parent } from 'unist'
import { isElement } from 'hast-util-is-element'
import { expect, test } from 'vitest'
import { isHastRootDivElement } from '#typeguards'
import markdownToHast from './markdown-to-hast.js'

/**
 * A realistic author document: headings (auto and explicit id), a paragraph with inline
 * formatting, a link and inline math, a flow MDX element, and a Tabs block.
 */
const GOLDEN_DOC = `# Section heading

## Subheading {#custom-id}

A paragraph with **bold**, \`inline code\`, and a
[link](https://example.org) plus an inline formula $x^2$.

<Info title="Heads up">

Info body paragraph.

</Info>

<Tabs>

<TabItem label="First">

First tab content.

</TabItem>

<TabItem label="Second">

Second tab content.

</TabItem>

</Tabs>
`

function elementChildren(parent: Parent): Element[] {
  return parent.children.filter((node): node is Element => isElement(node))
}

/** The golden tree is deterministic, so a missing child is a test failure with context */
function elementAt(parent: Parent, index: number): Element {
  const child = elementChildren(parent)[index]
  if (child === undefined) {
    throw new Error(`expected an element child at index ${String(index)}, got nothing`)
  }
  return child
}

function concatenatedText(parent: Parent): string {
  return parent.children
    .map((node): string => {
      if (node.type === 'text') {
        return (node as Text).value
      }
      return isElement(node) ? concatenatedText(node) : ''
    })
    .join('')
}

test('markdownToHast wraps every document in a root div marked root "true" that survives sanitization', async () => {
  // V1 regression pin (886dd19b): rehype-sanitize once stripped the `root` marker, so every
  // section page rendered nothing. The marker must survive sanitization and still satisfy
  // the isHastRootDivElement typeguard the renderer looks for.
  for (const markdown of [GOLDEN_DOC, 'Just a line of text.', '<Info title="Heads up">\n\nbody\n\n</Info>']) {
    const root = await markdownToHast(markdown)
    expect(root).toMatchObject({ type: 'element', tagName: 'div', properties: { root: 'true' } })
    expect(isHastRootDivElement(root)).toBe(true)
  }
})

test('the golden document keeps its top-level block order: two headings, a paragraph, Info, Tabs', async () => {
  const root = await markdownToHast(GOLDEN_DOC)
  expect(elementChildren(root).map((node) => node.tagName)).toEqual(['h1', 'h2', 'p', 'div', 'div'])
})

test('golden document headings carry an explicit id and an auto-generated id', async () => {
  // remarkHeadingId (mdast) applies `{#custom-id}`; rehypeSlug (hast) generates the rest.
  const root = await markdownToHast(GOLDEN_DOC)
  const h1 = elementAt(root, 0)
  const h2 = elementAt(root, 1)
  expect(h1).toMatchObject({ tagName: 'h1', properties: { id: 'section-heading' } })
  expect(h2).toMatchObject({ tagName: 'h2', properties: { id: 'custom-id' } })
})

test('the golden document paragraph keeps formatting, link and inline math in order', async () => {
  const root = await markdownToHast(GOLDEN_DOC)
  const paragraph = elementAt(root, 2)
  const strong = elementAt(paragraph, 0)
  const code = elementAt(paragraph, 1)
  const link = elementAt(paragraph, 2)
  const katex = elementAt(paragraph, 3)
  expect(paragraph).toMatchObject({ tagName: 'p' })
  expect(strong).toMatchObject({ tagName: 'strong', properties: {} })
  expect(concatenatedText(strong)).toBe('bold')
  expect(code).toMatchObject({ tagName: 'code', properties: {} })
  expect(link).toMatchObject({ tagName: 'a', properties: { href: 'https://example.org' } })
  expect(katex).toMatchObject({ tagName: 'span', properties: { className: ['katex'] } })
})

test('inline math becomes katex markup that survives the sanitizer', async () => {
  // Stage order: markdownToHast runs rehypeKatex after rehypeSanitize. The `katex` classes
  // and `ariaHidden` below are not in the sanitize allowlist, so their presence in the
  // output proves the katex transform ran last.
  const root = await markdownToHast(GOLDEN_DOC)
  const paragraph = elementAt(root, 2)
  const katex = elementAt(paragraph, elementChildren(paragraph).length - 1)
  const katexHtml = elementAt(katex, 0)
  expect(katex).toMatchObject({ tagName: 'span', properties: { className: ['katex'] } })
  expect(katexHtml).toMatchObject({ tagName: 'span', properties: { className: ['katex-html'], ariaHidden: 'true' } })
})

test('a flow MDX element becomes a div carrying exactly its allowlisted string attributes', async () => {
  // The mdxJsxFlowElement handler emits {title, name, type: 'mdxJsxFlowElement'}; sanitize
  // keeps title and name (common allowlist) and strips the `type` marker — the marker's
  // absence also proves the handlers ran before sanitization.
  const root = await markdownToHast(GOLDEN_DOC)
  const info = elementAt(root, 3)
  expect(info.properties).toStrictEqual({ title: 'Heads up', name: 'Info' })
  expect(concatenatedText(info)).toBe('Info body paragraph.')
})

test('Tabs collects its TabItem labels and numbers the items in order', async () => {
  // rehypeInnodoc (hast phase, after remark-rehype) appends `labels` to the Tabs block and a
  // string `index` to each TabItem; both are allowlisted on `div`, so they survive sanitize.
  const root = await markdownToHast(GOLDEN_DOC)
  const tabs = elementAt(root, 4)
  const first = elementAt(tabs, 0)
  const second = elementAt(tabs, 1)
  expect(tabs.properties).toStrictEqual({ name: 'Tabs', labels: ['First', 'Second'] })
  expect(first.properties).toStrictEqual({ name: 'TabItem', label: 'First', index: '0' })
  expect(second.properties).toStrictEqual({ name: 'TabItem', label: 'Second', index: '1' })
  expect(concatenatedText(first)).toBe('First tab content.')
})
