import type { Element, ElementContent } from 'hast'
import type { State } from 'mdast-util-to-hast'
import { isElement } from 'hast-util-is-element'
import { expect, test } from 'vitest'
import markdownToHast from '../../markdown-to-hast.js'
import remarkRehypeHandlers from './remark-rehype-handlers.js'

/** Handler as used in these tests: `(state, node)` -> element content or nothing. */
type HandlerLike = (state: State, node: unknown) => ElementContent[] | ElementContent | undefined

/** Sentinel children proving a handler used the `state.all(node)` result verbatim. */
const sentinelChildren = [{ type: 'element', tagName: 'sentinel', properties: {}, children: [] }]

const flowHandler = remarkRehypeHandlers.mdxJsxFlowElement as HandlerLike | undefined
const rootHandler = remarkRehypeHandlers.root as HandlerLike | undefined
const textHandler = remarkRehypeHandlers.mdxJsxTextElement as HandlerLike | undefined

function makeState() {
  const calls: unknown[] = []

  const state = {
    all: (node: unknown) => {
      calls.push(node)
      return sentinelChildren
    },
  }

  return { calls, state: state as unknown as State }
}

/** Invoke a handler, failing loudly if it is not registered. */
function call(handler: HandlerLike | undefined, state: State, node: unknown) {
  if (typeof handler !== 'function') {
    throw new TypeError('expected a registered handler')
  }

  return handler(state, node)
}

/** The child at `index` of `children`, which must be an element. */
function childAt(children: ElementContent[], index: number): Element {
  const child = children[index]

  if (!isElement(child)) {
    throw new TypeError('expected an element child')
  }

  return child
}

test('root handler wraps the parsed tree in a div marked root: true', () => {
  const { state } = makeState()

  const result = call(rootHandler, state, { type: 'root', children: [] })

  expect(result).toStrictEqual({
    type: 'element',
    tagName: 'div',
    properties: { root: 'true' },
    children: sentinelChildren,
  })
})

test('mdxJsxFlowElement handler turns a named MDX element into a div with its string attributes', () => {
  const { state } = makeState()
  const node = {
    type: 'mdxJsxFlowElement',
    name: 'GridItem',
    attributes: [
      { type: 'mdxJsxAttribute', name: 'xs', value: '12' },
      { type: 'mdxJsxAttribute', name: 'xs-offset', value: '2' },
    ],
    children: [],
  }

  const result = call(flowHandler, state, node)

  expect(result).toStrictEqual({
    type: 'element',
    tagName: 'div',
    properties: {
      'xs-offset': '2',
      name: 'GridItem',
      type: 'mdxJsxFlowElement',
      xs: '12',
    },
    children: sentinelChildren,
  })
})

test('mdxJsxFlowElement handler passes the element node itself to state.all', () => {
  const { calls, state } = makeState()
  const node = { type: 'mdxJsxFlowElement', name: 'GridItem', attributes: [], children: [] }

  call(flowHandler, state, node)

  expect(calls).toStrictEqual([node])
})

test('mdxJsxTextElement handler turns a named MDX element into a span with its string attributes', () => {
  const { state } = makeState()
  const node = {
    type: 'mdxJsxTextElement',
    name: 'TextQuestion',
    attributes: [{ type: 'mdxJsxAttribute', name: 'solution', value: '42' }],
    children: [{ type: 'text', value: 'what is x?' }],
  }

  const result = call(textHandler, state, node) as Element

  // children semantics are pinned by a separate task; here only tagName and properties
  expect(result.tagName).toBe('span')
  expect(result.properties).toStrictEqual({
    name: 'TextQuestion',
    solution: '42',
    type: 'mdxJsxTextElement',
  })
})

test('mdxJsxFlowElement handler drops expression attributes - only string values are extracted', () => {
  const { state } = makeState()
  const node = {
    type: 'mdxJsxFlowElement',
    name: 'Info',
    attributes: [
      { type: 'mdxJsxExpressionAttribute', name: 'title', value: '1 + 1' },
      { type: 'mdxJsxAttribute', name: 'level', value: '2' },
    ],
    children: [],
  }

  const result = call(flowHandler, state, node)

  expect(result).toStrictEqual({
    type: 'element',
    tagName: 'div',
    properties: {
      level: '2',
      name: 'Info',
      type: 'mdxJsxFlowElement',
    },
    children: sentinelChildren,
  })
})

test('pipeline: <Info title={1 + 1}> keeps name only - the expression attribute never reaches hast', async () => {
  const root = (await markdownToHast('<Info title={1 + 1}>\n\nx\n\n</Info>')) as unknown as Element
  const info = childAt(root.children, 0)

  expect(info.tagName).toBe('div')
  expect(info.properties).toStrictEqual({ name: 'Info' })

  const paragraph = childAt(info.children, 0)
  expect(paragraph.tagName).toBe('p')
  expect(paragraph.children[0]).toMatchObject({ type: 'text', value: 'x' })
})

test('mdxJsxFlowElement handler flattens a null-named (fragment) element into its converted children', () => {
  const { state } = makeState()

  const result = call(flowHandler, state, {
    type: 'mdxJsxFlowElement',
    name: null,
    attributes: [],
    children: [{ type: 'text', value: 'x' }],
  })

  // `mdast-util-to-hast`'s `state.all` spreads array results, so a fragment's
  // converted children flatten into the parent instead of being dropped.
  expect(result).toStrictEqual(sentinelChildren)
})

test('mdxJsxTextElement handler flattens a null-named (fragment) element into its converted children', () => {
  const { state } = makeState()

  const result = call(textHandler, state, {
    type: 'mdxJsxTextElement',
    name: null,
    attributes: [],
    children: [{ type: 'text', value: 'x' }],
  })

  expect(result).toStrictEqual(sentinelChildren)
})

// A null-named JSX fragment `<>x</>` is parsed as a null-named mdxJsxTextElement inside a
// paragraph. The handler returns `state.all(node)` for null names, so the fragment's content
// survives as the paragraph's children.
test('pipeline keeps the content of a null-named JSX fragment <>x</> in its paragraph', async () => {
  const root = (await markdownToHast('a\n\n<>x</>\n\nb')) as unknown as Element
  const first = childAt(root.children, 0)
  const fragment = childAt(root.children, 1)
  const last = childAt(root.children, 2)

  expect(root.children).toHaveLength(3)

  expect(first.tagName).toBe('p')
  expect(first.children[0]).toMatchObject({ type: 'text', value: 'a' })

  expect(fragment.tagName).toBe('p')
  expect(fragment.properties).toStrictEqual({})
  expect(fragment.children).toHaveLength(1)
  expect(fragment.children[0]).toMatchObject({ type: 'text', value: 'x' })

  expect(last.tagName).toBe('p')
  expect(last.children[0]).toMatchObject({ type: 'text', value: 'b' })
})

test('mdxJsxFlowElement handler drops attributes whose value is not a string (null value)', () => {
  const { state } = makeState()
  const node = {
    type: 'mdxJsxFlowElement',
    name: 'Info',
    attributes: [
      { type: 'mdxJsxAttribute', name: 'title', value: null },
      { type: 'mdxJsxAttribute', name: 'level', value: '2' },
    ],
    children: [],
  }

  const result = call(flowHandler, state, node)

  expect(result).toStrictEqual({
    type: 'element',
    tagName: 'div',
    properties: {
      level: '2',
      name: 'Info',
      type: 'mdxJsxFlowElement',
    },
    children: sentinelChildren,
  })
})

test('mdxJsxFlowElement handler ignores nodes that are not MDX flow elements', () => {
  const { state } = makeState()

  const result = call(flowHandler, state, { type: 'paragraph', children: [] })

  expect(result).toBeUndefined()
})
