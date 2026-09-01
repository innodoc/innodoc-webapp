import type { Element, Root } from 'hast'
import { visit } from 'unist-util-visit'
import { expect, test } from 'vitest'
import markdownToHast from '@innodoc/content-parser'

// markdownToHast returns the root div itself as the tree (typed as `Root`), so its `children`
// are the document blocks. These helpers walk that tree by structure, not by depth.

function allElements(node: Root | Element): Element[] {
  const out: Element[] = []
  for (const child of node.children) {
    if (child.type === 'element') {
      out.push(child, ...allElements(child))
    }
  }
  return out
}

function spansWith(root: Root | Element, ...klass: string[]): Element[] {
  return allElements(root).filter((el) => {
    const className = el.properties.className
    return el.tagName === 'span' && Array.isArray(className) && klass.every((k) => className.includes(k))
  })
}

function directParagraphs(root: Root): Element[] {
  return root.children.filter((c): c is Element => c.type === 'element' && c.tagName === 'p')
}

function allTexts(node: Root | Element): string[] {
  const out: string[] = []
  visit(node, 'text', (n) => out.push(n.value))
  return out
}

function directTexts(node: Element): string[] {
  return node.children.filter((c): c is { type: 'text'; value: string } => c.type === 'text').map((c) => c.value)
}

function katexSpanIn(node: Element): Element | undefined {
  return node.children.find((c): c is Element => {
    if (c.type !== 'element' || c.tagName !== 'span') {
      return false
    }
    const className = c.properties.className
    return Array.isArray(className) && className.includes('katex')
  })
}

test('keeps the katex class names on inline math that sanitize would strip', async () => {
  // V3: rehype-katex runs AFTER rehype-sanitize in markdown-to-hast.ts.
  // hast-util-sanitize's defaultSchema has no span attribute entry at all (its `*` list allows
  // neither className, style, nor ariaHidden), and sanitization/config.ts only adds className
  // to span restricted to the values 'math'/'math-inline'. So the 'katex'/'katex-html' class
  // names, the ariaHidden flag, and the inline styles below are only in the output tree because
  // katex transforms the math nodes after sanitize has run. Swapping those two plugin lines
  // would strip every class, flag, and style from every formula - a valid-but-different tree,
  // no error, every formula rendered unstyled (the 886dd19b class of silent breakage).
  // Targeted property assertions only: the full ~14-span structure churns on any katex bump.
  const root = await markdownToHast('Inline $x^2$ tail')

  expect(spansWith(root, 'katex').map((el) => el.properties.className)).toEqual([['katex']])

  const htmlLayer = spansWith(root, 'katex-html')
  expect(htmlLayer.length).toBeGreaterThan(0)
  expect(htmlLayer.every((el) => el.properties.ariaHidden === 'true')).toBe(true)

  expect(allElements(root).some((el) => el.tagName === 'span' && typeof el.properties.style === 'string')).toBe(true)
})

test('keeps the formula text when rendering inline math', async () => {
  const root = await markdownToHast('Inline $x^2$ tail')
  const texts = allTexts(root)
  expect(texts).toContain('x')
  expect(texts).toContain('2')
  expect(texts).not.toContain('$')
})

test('wraps inline math in the same paragraph as the surrounding text', async () => {
  const root = await markdownToHast('Inline $x^2$ tail')

  // Exactly one top-level <p>, and that single <p> holds both the surrounding text and the
  // katex span - i.e. the formula is inline, not promoted to its own block.
  const paragraphs = directParagraphs(root)
  expect(paragraphs.length).toBe(1)
  expect(paragraphs.every((p) => katexSpanIn(p) !== undefined)).toBe(true)
  expect(paragraphs.flatMap((p) => directTexts(p))).toEqual(['Inline ', ' tail'])
})

test('puts display math in its own paragraph with the same outer span classes', async () => {
  // Display and inline math differ in block placement only: a display formula gets its own
  // <p>, while the outer katex span's class list is exactly ['katex'] in both modes. No
  // 'math-display' (or 'math-inline') class is emitted - the math* className entries in
  // sanitization/config.ts do not match what this katex output shape produces.
  const displayMath = String.raw`$$\frac{a}{b}$$`
  const root = await markdownToHast(`Before\n\n${displayMath}\n\nAfter`)

  // Three top-level paragraphs: the two text blocks plus the one holding the formula.
  const paragraphs = directParagraphs(root)
  expect(paragraphs.length).toBe(3)

  expect(spansWith(root, 'katex').map((el) => el.properties.className)).toEqual([['katex']])

  // The (single) katex span is the sole child of exactly one of those paragraphs.
  const owners = paragraphs.filter((p) => katexSpanIn(p) !== undefined)
  expect(owners.length).toBe(1)
  expect(owners.every((p) => p.children.length === 1)).toBe(true)

  const allClassNames = allElements(root).flatMap((el) => {
    const className = el.properties.className
    return Array.isArray(className) ? className : []
  })
  expect(allClassNames).not.toContain('math-display')
  expect(allClassNames).not.toContain('math-inline')
})

test('renders invalid inline LaTeX as an error span instead of rejecting', async () => {
  // V4: invalid LaTeX must not reject the pipeline. If this ever rejects instead, the
  // markdown-to-hast worker's catch path can hang the page: the client awaits a hast result
  // that never arrives (campaign task T09 pins the error contract of this rejection path).
  const root = await markdownToHast(String.raw`$\frac{1}$`)

  const errors = spansWith(root, 'katex-error')
  expect(errors.length).toBe(1)
  expect(errors.map((el) => el.properties.title)).toEqual([expect.stringMatching(/^ParseError: KaTeX parse error:/u)])

  // The error span sits in a top-level <p>, and the raw formula is kept as its text.
  const owners = directParagraphs(root).filter((p) => spansWith(p, 'katex-error').length === 1)
  expect(owners.length).toBe(1)
  expect(owners.flatMap((p) => allTexts(p))).toEqual([String.raw`\frac{1}`])
})

test('renders invalid display LaTeX as an error span in its own paragraph', async () => {
  const root = await markdownToHast(String.raw`$$\frac{1}$$`)

  const errors = spansWith(root, 'katex-error')
  expect(errors.map((el) => el.properties.className)).toEqual([['katex-error']])
  expect(errors.map((el) => el.properties.title)).toEqual([expect.stringMatching(/^ParseError: KaTeX parse error:/u)])

  const owners = directParagraphs(root).filter((p) => spansWith(p, 'katex-error').length === 1)
  expect(owners.length).toBe(1)
  expect(owners.flatMap((p) => allTexts(p))).toEqual([String.raw`\frac{1}`])
})

test('strips a className written by the author on a span but keeps the allowlisted ones', async () => {
  // Negative control proving the allowlist interplay is real: the same span that keeps the
  // author's allowlisted 'solution' property has the author's 'className' stripped (only
  // 'math'/'math-inline' values are allowed on span). katex's class names survive on their
  // spans purely because katex runs after sanitize - not because the allowlist admits them.
  const root = await markdownToHast('a <TextQuestion solution="42" className="evil">q</TextQuestion> b')
  const spans = allElements(root).filter((el) => el.tagName === 'span' && el.properties.name === 'TextQuestion')
  expect(spans.map((el) => el.properties)).toEqual([{ solution: '42', name: 'TextQuestion' }])
})
