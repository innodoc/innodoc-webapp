/**
 * Pin + finding — inline MDX element children are deleted (campaign plan §4.3).
 *
 * `mdxJsxTextElement` in `remark-rehype-handlers.ts` literally returns
 * `children: []` — so for `a <TextQuestion ...>what is x?</TextQuestion> b` the
 * question prompt text is never in the output tree. The flow handler for the same
 * component (`mdxJsxFlowElement`) uses `state.all(node)`, the contrast pinned at
 * the end.
 *
 * Whether this is intended is an exercises-domain question (ui-content's
 * `SpanNode` is itself `TODO: fix span node` and currently returns `null`); the
 * parser's contract today is simply "an inline MDX element renders empty". These
 * pins make any future change — fix or further loss — trip a test here.
 *
 * This file owns CHILDREN semantics for text elements only; the handlers'
 * tagName/properties shape is pinned by `remark-rehype-handlers.test.ts` (T03).
 */
import type { Element } from 'hast'
import type { MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx-jsx'
import type { State } from 'mdast-util-to-hast'
import { isElement } from 'hast-util-is-element'
import { visit } from 'unist-util-visit'
import { expect, test } from 'vitest'
import markdownToHast from '../../markdown-to-hast.js'
import remarkRehypeHandlers from './remark-rehype-handlers.js'

/**
 * The handlers under test only observe `state.all(node)`; the third `parent`
 * parameter of the full `Handler` signature is unused by them.
 */
type HandlerUnderTest = (state: State, node: unknown) => Element | undefined

/** Marker hast node proving whether the handler delegated to `state.all`. */
function sentinel(tagName: string): Element {
  return { type: 'element', tagName, properties: {}, children: [] }
}

/** Minimal handler state — only `all` is observable in these handler unit tests. */
function stateThatAlls(children: Element[]): State {
  return { all: () => children } as unknown as State
}

const textElement: MdxJsxTextElement = {
  type: 'mdxJsxTextElement',
  name: 'TextQuestion',
  attributes: [
    { type: 'mdxJsxAttribute', name: 'solution', value: '42' },
    { type: 'mdxJsxAttribute', name: 'points', value: '5' },
  ],
  children: [{ type: 'text', value: 'what is x?' }],
}

test('FIXME(parser-loss): mdxJsxTextElement discards its children instead of transforming them', () => {
  const handler = remarkRehypeHandlers.mdxJsxTextElement as HandlerUnderTest | undefined
  if (handler === undefined) {
    throw new Error('mdxJsxTextElement handler is missing')
  }

  const [first, second] = [sentinel('span'), sentinel('b')]
  const result = handler(stateThatAlls([first, second]), textElement)
  if (!isElement(result)) {
    throw new Error('mdxJsxTextElement handler did not return an element')
  }

  // The handler is written literally as `children: []`: the sentinels returned by
  // state.all never reach the span, so inline MDX elements render empty today.
  expect(result.children).toEqual([])
})

test('FIXME(parser-loss): inline TextQuestion prompt text is never in the output tree', async () => {
  const root = await markdownToHast('a <TextQuestion solution="42" points="5">what is x?</TextQuestion> b')

  const spans: Element[] = []
  const texts: string[] = []
  visit(root, (node) => {
    if (node.type === 'element' && node.tagName === 'span' && node.properties.name === 'TextQuestion') {
      spans.push(node)
    }
    if (node.type === 'text') {
      texts.push(node.value)
    }
  })

  expect(spans).toHaveLength(1)
  const span = spans[0]
  if (span === undefined) {
    throw new Error('TextQuestion span is missing')
  }

  // §4.3: the question element arrives with its string props intact but no children…
  expect(span.properties).toEqual({ solution: '42', points: '5', name: 'TextQuestion' })
  expect(span.children).toEqual([])

  // …and the prompt text is discarded, not merely relocated elsewhere in the tree.
  expect(texts).not.toContain('what is x?')
  expect(texts.join(' ')).not.toContain('what is x?')
})

test('contrast: the same component in flow position keeps its children (state.all IS used)', () => {
  const flowElement: MdxJsxFlowElement = {
    type: 'mdxJsxFlowElement',
    name: 'TextQuestion',
    attributes: [{ type: 'mdxJsxAttribute', name: 'solution', value: '42' }],
    children: [{ type: 'paragraph', children: [{ type: 'text', value: 'what is x?' }] }],
  }
  const handler = remarkRehypeHandlers.mdxJsxFlowElement as HandlerUnderTest | undefined
  if (handler === undefined) {
    throw new Error('mdxJsxFlowElement handler is missing')
  }

  const kept = sentinel('p')
  const result = handler(stateThatAlls([kept]), flowElement)
  if (!isElement(result)) {
    throw new Error('mdxJsxFlowElement handler did not return an element')
  }

  // Hand-rolled unit only: the flow handler delegates to state.all, so children
  // survive at handler level. What block-position elements lose later (the question
  // props at sanitization time) is pinned by the prop-casing tests (T14), not here.
  expect(result.children).toEqual([kept])
})
