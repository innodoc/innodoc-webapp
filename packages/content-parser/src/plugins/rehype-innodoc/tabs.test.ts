import type { Element, Root } from 'hast'
import { visit } from 'unist-util-visit'
import { expect, test } from 'vitest'
import markdownToHast from '../../markdown-to-hast.js'

/**
 * V6 invariant: `rehype-innodoc/tabs.ts` appends a `labels` array to `Tabs` blocks and a
 * sequential `index` to each `TabItem`. The counter lives in a MODULE-LEVEL `let tabIndex`,
 * reset whenever a `Tabs` block opens, and `rehype-innodoc` runs BEFORE `rehype-sanitize` —
 * the only reason `labels`/`index` are in the final tree at all.
 *
 * The cross-parse/concurrency tripwire on that module counter is pinned by
 * `tabs-concurrency.test.ts` (T06); this file only pins the sequential, single-parse
 * behaviour. Where reality deviates from the planning doc it is pinned as-is and noted.
 */

function elementsByName(root: Root, name: string): Element[] {
  const found: Element[] = []
  visit(root, 'element', (el) => {
    if (el.properties.name === name) {
      found.push(el)
    }
  })
  return found
}

const singleBlockTabs = `<Tabs>
<TabItem label="A0">

a0

</TabItem>
<TabItem label="A1">

a1

</TabItem>
<TabItem label="A2">

a2

</TabItem>
</Tabs>`

const twoBlockTabs = `<Tabs>
<TabItem label="P0">

p0

</TabItem>
<TabItem label="P1">

p1

</TabItem>
</Tabs>

<Tabs>
<TabItem label="Q0">

q0

</TabItem>
<TabItem label="Q1">

q1

</TabItem>
</Tabs>`

const mixedChildrenTabs = `<Tabs>
<TabItem label="B0">

b0

</TabItem>

stray paragraph

<Info label="not-a-tab">

info body

</Info>

<TabItem label="B1">

b1

</TabItem>
</Tabs>`

const unlabeledItemTabs = `<Tabs>
<TabItem label="C0">

c0

</TabItem>
<TabItem>

no label here

</TabItem>
</Tabs>`

const orphanAfterTabs = `<Tabs>
<TabItem label="D0">

d0

</TabItem>
<TabItem label="D1">

d1

</TabItem>
</Tabs>

<TabItem label="orphan">

orphan body

</TabItem>`

test('collects the TabItem labels in order onto the Tabs block', async () => {
  const root = await markdownToHast(singleBlockTabs)
  const tabs = elementsByName(root, 'Tabs')
  // The aggregated list is the only labels data on the block: no `index`, no raw `label`.
  expect(tabs.map((el) => el.properties)).toEqual([{ name: 'Tabs', labels: ['A0', 'A1', 'A2'] }])
})

test('assigns sequential string indexes to the TabItems of a block', async () => {
  const root = await markdownToHast(singleBlockTabs)
  const items = elementsByName(root, 'TabItem')
  // `tabs.ts` stores `(tabIndex++).toString()` — the stringness is part of the contract;
  // `toEqual` on strings pins it (a numeric `0` would not equal `'0'`).
  expect(items.map((el) => el.properties.index)).toEqual(['0', '1', '2'])
})

test('collects labels and restarts index numbering per Tabs block', async () => {
  const root = await markdownToHast(twoBlockTabs)
  const tabs = elementsByName(root, 'Tabs')
  expect(tabs.map((el) => el.properties.labels)).toEqual([
    ['P0', 'P1'],
    ['Q0', 'Q1'],
  ])
  const items = elementsByName(root, 'TabItem')
  expect(items.map((el) => el.properties.index)).toEqual(['0', '1', '0', '1'])
})

test('only TabItem children contribute to the Tabs labels or the index counter', async () => {
  const root = await markdownToHast(mixedChildrenTabs)
  const tabs = elementsByName(root, 'Tabs')
  expect(tabs.map((el) => el.properties.labels)).toEqual([['B0', 'B1']])
  // The stray paragraph and the non-TabItem element stay in the tree, contribute nothing,
  // and do not consume a counter slot: B1 still gets index '1', not '2'.
  for (const tabsBlock of tabs) {
    expect(tabsBlock.children.map((child) => (child as Element).tagName)).toEqual(['div', 'p', 'div', 'div'])
  }
  const infos = elementsByName(root, 'Info')
  expect(infos.map((el) => 'index' in el.properties)).toEqual([false])
  const items = elementsByName(root, 'TabItem')
  expect(items.map((el) => el.properties.index)).toEqual(['0', '1'])
})

test('leaves a TabItem without a label attribute unindexed', async () => {
  const root = await markdownToHast(unlabeledItemTabs)
  const tabs = elementsByName(root, 'Tabs')
  // The unlabeled item is not a TabItem per the typeguard (label must be a string), so it
  // is neither collected as a label nor numbered.
  expect(tabs.map((el) => el.properties.labels)).toEqual([['C0']])
  const items = elementsByName(root, 'TabItem')
  expect(items.map((el) => el.properties)).toEqual([{ label: 'C0', name: 'TabItem', index: '0' }, { name: 'TabItem' }])
})

test('keeps the raw label attribute on the TabItem elements themselves', async () => {
  // Deviation from the planning doc: the raw `label` attribute is NOT stripped by
  // rehype-sanitize — hast-util-sanitize's default `*` wildcard allows `label` (and
  // `name`) on every tag — so it survives alongside the aggregated `labels` list on the
  // Tabs block.
  const root = await markdownToHast(singleBlockTabs)
  const items = elementsByName(root, 'TabItem')
  expect(items.map((el) => el.properties.label)).toEqual(['A0', 'A1', 'A2'])
})

test('numbers a TabItem outside any Tabs block from the module-level counter', async () => {
  // The value '2' is deterministic only because the Tabs block earlier in THIS document
  // resets the module-level counter to 0 before the two items consume 0 and 1. Without a
  // Tabs block the orphan's number would depend on everything parsed earlier in the
  // process — that cross-document leak is the hazard pinned by tabs-concurrency.test.ts.
  const root = await markdownToHast(orphanAfterTabs)
  expect(root.children).toHaveLength(2)
  const [tabsBlock, orphan] = root.children as [Element, Element]
  expect(tabsBlock.properties.name).toBe('Tabs')
  expect(orphan.properties).toEqual({ label: 'orphan', name: 'TabItem', index: '2' })
})

test('continues the module-level counter across separate parses of a Tabs-less document', async () => {
  const orphan = `<TabItem label="solo">

solo body

</TabItem>`
  const firstRoot = await markdownToHast(orphan)
  const secondRoot = await markdownToHast(orphan)
  const firstIndex = (firstRoot.children as [Element])[0].properties.index
  const secondIndex = (secondRoot.children as [Element])[0].properties.index
  // The counter never resets without a Tabs block, so the second parse continues where the
  // first left off — the absolute value is process-state dependent, the continuation is not.
  expect(typeof firstIndex).toBe('string')
  expect(secondIndex).toBe(String(Number(firstIndex) + 1))
})
