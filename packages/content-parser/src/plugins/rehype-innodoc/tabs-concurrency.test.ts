/**
 * Concurrency and repeat guardrails for the module-global tab counter in
 * `tabs.ts`: `let tabIndex` lives at module scope and is only reset when a
 * `Tabs` block opens.
 *
 * The counter is correct ONLY while the pipeline transform stays synchronous.
 * `markdownToHast` is `processor.run(processor.parse(code))` with all-sync
 * plugins, so each document's transform runs to completion atomically inside
 * one task — two documents parsed by the same module instance can never
 * observe each other's counter state. An async plugin upstream of
 * `rehype-innodoc`, or a worker that interleaves two documents' transforms
 * inside one module instance, would interleave the counter and corrupt the
 * `index` values. These tests are the tripwire for that: if any of them start
 * failing, the counter is no longer safe to share at module scope.
 */
import type { Root } from 'hast'
import { expect, test } from 'vitest'
import markdownToHast from '../../markdown-to-hast.js'

type HastContent = Root['children'][number]

interface TabBlock {
  labels: string[]
  indices: string[]
}

/** Read every Tabs block's `labels` array and its TabItem children's `index` values. */
function readTabBlocks(root: Root): TabBlock[] {
  const blocks: TabBlock[] = []

  const walk = (node: HastContent): void => {
    if (node.type !== 'element') {
      return
    }
    if (node.properties.name === 'Tabs') {
      const block: TabBlock = {
        labels: [...((node.properties.labels as string[] | undefined) ?? [])],
        indices: [],
      }
      for (const child of node.children) {
        if (child.type === 'element' && child.properties.name === 'TabItem') {
          block.indices.push(child.properties.index as string)
        }
      }
      blocks.push(block)
      return
    }
    for (const child of node.children) {
      walk(child)
    }
  }

  for (const child of root.children) {
    walk(child)
  }

  return blocks
}

const DOC_A =
  '<Tabs>\n' +
  '<TabItem label="A0">\n\na0\n\n</TabItem>\n' +
  '<TabItem label="A1">\n\na1\n\n</TabItem>\n' +
  '<TabItem label="A2">\n\na2\n\n</TabItem>\n' +
  '</Tabs>\n'

const DOC_B =
  '<Tabs>\n' + '<TabItem label="B0">\n\nb0\n\n</TabItem>\n' + '<TabItem label="B1">\n\nb1\n\n</TabItem>\n' + '</Tabs>\n'

// Two sequential Tabs blocks: the counter must restart at the second block.
const DOC_C =
  '<Tabs>\n' +
  '<TabItem label="C0">\n\nc0\n\n</TabItem>\n' +
  '<TabItem label="C1">\n\nc1\n\n</TabItem>\n' +
  '</Tabs>\n\n' +
  '<Tabs>\n' +
  '<TabItem label="C2">\n\nc2\n\n</TabItem>\n' +
  '</Tabs>\n'

const EXPECTED_A: TabBlock[] = [{ labels: ['A0', 'A1', 'A2'], indices: ['0', '1', '2'] }]
const EXPECTED_B: TabBlock[] = [{ labels: ['B0', 'B1'], indices: ['0', '1'] }]
const EXPECTED_C: TabBlock[] = [
  { labels: ['C0', 'C1'], indices: ['0', '1'] },
  { labels: ['C2'], indices: ['0'] },
]

test('two concurrent parses of different tabs documents keep independent labels and indices', async () => {
  const [rootA, rootB] = await Promise.all([markdownToHast(DOC_A), markdownToHast(DOC_B)])

  expect(readTabBlocks(rootA)).toEqual(EXPECTED_A)
  expect(readTabBlocks(rootB)).toEqual(EXPECTED_B)
})

test('three concurrent parses of different tabs documents each keep their own labels and indices', async () => {
  const [rootA, rootB, rootC] = await Promise.all([markdownToHast(DOC_A), markdownToHast(DOC_B), markdownToHast(DOC_C)])

  expect(readTabBlocks(rootA)).toEqual(EXPECTED_A)
  expect(readTabBlocks(rootB)).toEqual(EXPECTED_B)
  expect(readTabBlocks(rootC)).toEqual(EXPECTED_C)
})

test('two concurrent parses of the same tabs document produce identical correct results', async () => {
  const [root1, root2] = await Promise.all([markdownToHast(DOC_C), markdownToHast(DOC_C)])

  expect(readTabBlocks(root1)).toEqual(EXPECTED_C)
  expect(readTabBlocks(root2)).toEqual(readTabBlocks(root1))
})

test('parsing the same tabs document twice sequentially does not drift the counter', async () => {
  const first = await markdownToHast(DOC_C)
  const second = await markdownToHast(DOC_C)

  expect(readTabBlocks(first)).toEqual(EXPECTED_C)
  expect(readTabBlocks(second)).toEqual(readTabBlocks(first))
})

test('staggered parse starts (A started, microtask tick, B started) stay independent', async () => {
  const parseA = markdownToHast(DOC_A)
  // Let any pending microtasks run before B's parse starts, the realistic
  // worker shape of fire-and-forget document parsing.
  await Promise.resolve()
  const parseB = markdownToHast(DOC_B)
  const [rootA, rootB] = await Promise.all([parseA, parseB])

  expect(readTabBlocks(rootA)).toEqual(EXPECTED_A)
  expect(readTabBlocks(rootB)).toEqual(EXPECTED_B)
})
