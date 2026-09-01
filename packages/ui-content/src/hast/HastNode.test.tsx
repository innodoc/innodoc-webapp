/* oxlint-disable react/react-compiler -- the probe captures the node HastNode returns in a module
variable during render; a test-only capture pattern, the component itself is unmodified */
import type { Root } from 'hast'
import type { ReactNode } from 'react'
import { act } from 'react'
import { expect, test } from 'vitest'
import { addHastResult } from '@innodoc/shared-store/slices/hast'
import theme from '@innodoc/ui-design-system/theme'
import { createTestHarness, screen } from '@innodoc/ui-test-utils'
import HastNode from './HastNode.js'

/** Minimal hast root: a single paragraph, what a Markdown line like `text` parses to */
function paragraphRoot(text: string): Root {
  return {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'p',
        properties: {},
        children: [{ type: 'text', value: text }],
      },
    ],
  }
}

test('HastNode renders the converted content for its hash', () => {
  const harness = createTestHarness()
  harness.store.dispatch(addHastResult({ hash: 'content', root: paragraphRoot('Hello content') }))

  harness.render(<HastNode hash="content" />)

  expect(screen.getByText('Hello content')).toBeInTheDocument()
})

test('HastNode renders the parser error for a failed parse', () => {
  // the error UI reads the design system's palette augmentation, so it needs the app's theme
  const harness = createTestHarness({ theme })
  harness.store.dispatch(
    addHastResult({
      hash: 'broken',
      error: {
        column: 7,
        line: 3,
        reason: 'Unexpected end of input',
        ruleId: 'unexpected-end',
        source: 'mdast-util-from-markdown',
      },
    }),
  )

  harness.render(<HastNode hash="broken" />)

  expect(screen.getByText('Unexpected end of input')).toBeInTheDocument()
})

test('HastNode renders nothing when there is no result for the hash', () => {
  const harness = createTestHarness()
  // a result without root or error, the shape the parser emits for empty content
  harness.store.dispatch(addHastResult({ hash: 'empty' }))

  const { container } = harness.render(<HastNode hash="no-such-hash" />)
  expect(container.innerHTML).toBe('')

  const { container: emptyContainer } = harness.render(<HastNode hash="empty" />)
  expect(emptyContainer.innerHTML).toBe('')
})

// Regression gate: the AST -> React conversion ran on every render of the host component, so any
// store change reaching it rebuilt the whole content tree. The probe captures the node HastNode
// returns (calling the component during the probe's render, so its hooks run in context); with
// the same store result, that node must keep its reference so React can skip the entire subtree
// below it.
const seen: ReactNode[] = []

function Probe({ hash }: { hash: string }) {
  const node = HastNode({ hash })
  seen.push(node)
  return node
}

test('HastNode keeps the returned node reference stable across re-renders with the same hash', () => {
  const harness = createTestHarness()
  harness.store.dispatch(addHastResult({ hash: 'stable', root: paragraphRoot('Hello content') }))

  const from = seen.length
  const { rerender } = harness.render(<Probe hash="stable" />)
  rerender(<Probe hash="stable" />)

  expect(seen[from + 1]).toBe(seen[from])
})

test('HastNode returns a new node when the store result for its hash changes', () => {
  const harness = createTestHarness()
  harness.store.dispatch(addHastResult({ hash: 'changing', root: paragraphRoot('First') }))

  const from = seen.length
  const { rerender } = harness.render(<Probe hash="changing" />) // seen[from]
  act(() => {
    harness.store.dispatch(addHastResult({ hash: 'changing', root: paragraphRoot('Second') }))
  }) // seen[from + 1]: the store change re-renders the subscribed probe
  rerender(<Probe hash="changing" />) // seen[from + 2]

  expect(seen[from + 1]).not.toBe(seen[from]) // changed content -> new converted tree
  expect(seen[from + 2]).toBe(seen[from + 1]) // ...and stable again for the unchanged result
})
