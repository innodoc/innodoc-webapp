/**
 * CHILDREN semantics for inline MDX text elements (campaign plan §4.3).
 *
 * `mdxJsxTextElement` in `remark-rehype-handlers.ts` transforms its children with
 * `state.all(node)`, so for `a <TextQuestion ...>what is x?</TextQuestion> b` the
 * question prompt text is in the output tree — the same delegation the flow handler
 * for the same component (`mdxJsxFlowElement`) uses, the contrast pinned at the end.
 * These pins trip if inline children are ever deleted (or further lost) again.
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

test('mdxJsxTextElement keeps its children by transforming them with state.all', () => {
  const handler = remarkRehypeHandlers.mdxJsxTextElement as HandlerUnderTest | undefined
  if (handler === undefined) {
    throw new Error('mdxJsxTextElement handler is missing')
  }

  const [first, second] = [sentinel('span'), sentinel('b')]
  const result = handler(stateThatAlls([first, second]), textElement)
  if (!isElement(result)) {
    throw new Error('mdxJsxTextElement handler did not return an element')
  }

  // The handler delegates to state.all, so the sentinels reach the span and inline
  // MDX elements keep their content.
  expect(result.children).toEqual([first, second])
})

test('inline TextQuestion keeps its prompt text in the output tree', async () => {
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

  // The question element arrives with its string props intact and its children transformed…
  expect(span.properties).toEqual({ solution: '42', points: '5', name: 'TextQuestion' })
  expect(span.children).toHaveLength(1)
  expect(span.children[0]).toMatchObject({ type: 'text', value: 'what is x?' })

  // …and the prompt text is in the final tree, not discarded.
  expect(texts).toContain('what is x?')
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
