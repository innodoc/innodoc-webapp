import type { Element as HastElement, Nodes } from 'hast'
import { expect, test, vi } from 'vitest'
import markdownToHast from '@innodoc/content-parser'
import { createTestHarness, screen } from '@innodoc/ui-test-utils'
import DivNode from './DivNode.js'

/** Real pipeline input: the MDX tabs syntax the parser supports (see `rehype-innodoc/tabs.test.ts`) */
const tabsDoc = `<Tabs>
<TabItem label="A0">

a0

</TabItem>
<TabItem label="A1">

a1

</TabItem>
</Tabs>`

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

// jsdom has no ResizeObserver, which the Tabs component uses to auto-size its panels
class ResizeObserverStub {
  observe = vi.fn<(target: Element) => void>()

  unobserve = vi.fn<(target: Element) => void>()

  disconnect = vi.fn<() => void>()
}

vi.stubGlobal('ResizeObserver', ResizeObserverStub)

test('DivNode dispatches a real pipeline Tabs block to the Tabs component', async () => {
  const root = await markdownToHast(tabsDoc)
  const tabsDiv = findElement(root, (el) => el.tagName === 'div' && el.properties.name === 'Tabs')

  const harness = createTestHarness()
  harness.render(<DivNode node={tabsDiv}>{null}</DivNode>)

  expect(screen.getByRole('tablist')).toBeInTheDocument()
  expect(screen.getByRole('tab', { name: 'A0' })).toBeInTheDocument()
  expect(screen.getByRole('tab', { name: 'A1' })).toBeInTheDocument()
})

test('DivNode renders a bare div for an MDX element whose name is not a known component', async () => {
  // Unknown authored components (and raw HTML tags written as JSX, which parse to a name equal
  // to the tag) must fall back to the plain div instead of crashing on a missing component.
  const root = await markdownToHast('<Foo>\n\nbar\n\n</Foo>')
  const fooDiv = findElement(root, (el) => el.tagName === 'div' && el.properties.name === 'Foo')

  const harness = createTestHarness()
  harness.render(<DivNode node={fooDiv}>bar content</DivNode>)

  const text = screen.getByText('bar content')
  expect(text.parentElement?.tagName).toBe('DIV')
  expect(text.parentElement?.className).toBe('')
})

test('DivNode dispatches a real pipeline block TextQuestion to the TextQuestion component', async () => {
  // A question written on its own line is promoted to a flow element (div). The div keeps its
  // question props (allowlisted on div, not just span) and its dispatch name, so DivNode must
  // route it to the TextQuestion component instead of the bare-div fallback.
  const root = await markdownToHast('<TextQuestion solution="42" points="5">\n\nwhat is x?\n\n</TextQuestion>')
  const questionDiv = findElement(root, (el) => el.tagName === 'div' && el.properties.name === 'TextQuestion')

  // Tree level: the flow div carries its question props through sanitize.
  expect(questionDiv.properties).toMatchObject({ name: 'TextQuestion', solution: '42', points: '5' })

  // Consumer level: DivNode dispatches to the TextQuestion component, so its input field renders.
  // (The widget discards its children by design, so we do not assert on the authored prompt text.)
  const harness = createTestHarness()
  harness.render(<DivNode node={questionDiv}>{null}</DivNode>)

  expect(screen.getByRole('textbox')).toBeInTheDocument()
})
