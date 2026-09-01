import type { Element as HastElement, Nodes } from 'hast'
import { expect, test, vi } from 'vitest'
import markdownToHast from '@innodoc/content-parser'
import { addHastResult } from '@innodoc/shared-store/slices/hast'
import { createTestHarness, screen } from '@innodoc/ui-test-utils'
import HastNode from '#hast'
import SpanNode from './SpanNode.js'

function collectElements(node: Nodes, out: HastElement[] = []): HastElement[] {
  if (node.type === 'element') {
    out.push(node)
  }
  for (const child of (node as { children?: Nodes[] }).children ?? []) {
    collectElements(child, out)
  }
  return out
}

/** Finds an element in a real pipeline tree, failing the test if the tree shape is wrong */
function findElement(root: Nodes, predicate: (el: HastElement) => boolean): HastElement {
  const found = collectElements(root).find((el) => predicate(el))
  if (found === undefined) {
    throw new Error('pipeline output is missing the expected element')
  }
  return found
}

/** The content of these inline elements is a single text node */
function textOf(node: Nodes | undefined): string {
  if (node?.type === 'text') {
    return node.value
  }
  throw new Error('unexpected non-text child')
}

test('SpanNode renders a real pipeline TextQuestion span via the bare span fallback', async () => {
  // TextQuestion is deliberately absent from the span map (see the comment there), so an inline
  // question must take the fallback path: the authored prompt text stays visible in a bare span,
  // and no answer field is rendered.
  const root = await markdownToHast('a <TextQuestion solution="42" points="5">what is x?</TextQuestion> b')
  const span = findElement(root, (el) => el.tagName === 'span' && el.properties.name === 'TextQuestion')

  const harness = createTestHarness()
  harness.render(<SpanNode node={span}>{textOf(span.children[0])}</SpanNode>)

  const spanEl = screen.getByText('what is x?')
  expect(spanEl.tagName).toBe('SPAN')
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
})

test('SpanNode renders a bare span with its content for an unmapped inline name', async () => {
  // Unknown authored components (and raw HTML tags written as JSX, which parse to a name equal
  // to the tag) must fall back to the plain span keeping their content instead of vanishing or
  // crashing on a missing component.
  const root = await markdownToHast('a <Custom>inline custom</Custom> b')
  const span = findElement(root, (el) => el.tagName === 'span' && el.properties.name === 'Custom')

  const harness = createTestHarness()
  harness.render(<SpanNode node={span}>{textOf(span.children[0])}</SpanNode>)

  const spanEl = screen.getByText('inline custom')
  expect(spanEl.tagName).toBe('SPAN')
  expect(spanEl.className).toBe('')
})

// Regression: the real-pipeline render of an inline MDX element inside a paragraph must not
// produce invalid DOM nesting. A component dispatched to here whose root is a block element
// (e.g. a MUI TextField root, div.MuiFormControl-root) would place a div inside the <p> that
// wraps the inline element, which a browser's HTML parser repairs by splitting the paragraph.
// Standalone <SpanNode> renders (the tests above) can never see this; only the full-pipeline
// tree, where the span sits inside its paragraph, can.
test('a real pipeline inline MDX element inside a paragraph renders without block nesting in the DOM', async () => {
  const root = await markdownToHast('a <TextQuestion solution="42" points="5">what is x?</TextQuestion> b')

  // React's validateDOMNesting reports invalid nesting via console.error
  const errors: string[] = []
  const errorSpy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    errors.push(args.map(String).join(' '))
  })

  try {
    const harness = createTestHarness()
    harness.store.dispatch(addHastResult({ hash: 'inline-nesting', root }))
    const { container } = harness.render(<HastNode hash="inline-nesting" />)

    // the authored inline content is visible
    expect(screen.getByText(/what is x\?/u)).toBeInTheDocument()

    // no div may descend from the paragraph that wraps the inline element
    expect(container.querySelector('p div')).toBeNull()

    // and React must not have reported the invalid nesting
    const nestingWarnings = errors.filter((message) => /cannot be a descendant of|validateDOMNesting/iu.test(message))
    expect(nestingWarnings).toEqual([])
  } finally {
    errorSpy.mockRestore()
  }
})
