import type { Element, Properties } from 'hast'
import { expect, test } from 'vitest'
import {
  isHastMdxJsxFlowDivElement,
  isHastMdxJsxFlowDivElementTabItem,
  isHastMdxJsxFlowDivElementTabs,
  isHastMdxJsxTextSpanElement,
  isHastRootDivElement,
} from './custom-hast.js'

function div(properties: Properties): Element {
  return { type: 'element', tagName: 'div', properties, children: [] }
}

function span(properties: Properties): Element {
  return { type: 'element', tagName: 'span', properties, children: [] }
}

test('isHastMdxJsxFlowDivElement matches a div carrying a string name, as sanitized trees do', () => {
  // After sanitize only `name` survives (the handler's `type` marker is not allowlisted), so
  // the guard must key on `name` alone.
  expect(isHastMdxJsxFlowDivElement(div({ name: 'Tabs', labels: ['A0', 'A1'] }))).toBe(true)
  expect(isHastMdxJsxFlowDivElement(div({ name: 'Grid', title: 'x' }))).toBe(true)
})

test('isHastMdxJsxFlowDivElement rejects divs without a name and non-div elements', () => {
  expect(isHastMdxJsxFlowDivElement(div({}))).toBe(false)
  expect(isHastMdxJsxFlowDivElement(div({ root: 'true' }))).toBe(false)
  expect(isHastMdxJsxFlowDivElement(span({ name: 'Tabs' }))).toBe(false)
})

test('isHastMdxJsxTextSpanElement matches a span carrying a string name, as sanitized trees do', () => {
  expect(isHastMdxJsxTextSpanElement(span({ name: 'TextQuestion', solution: '42' }))).toBe(true)
  expect(isHastMdxJsxTextSpanElement(span({}))).toBe(false)
  expect(isHastMdxJsxTextSpanElement(div({ name: 'TextQuestion' }))).toBe(false)
})

test('the tab guards require their exact names on top of the flow div guard', () => {
  expect(isHastMdxJsxFlowDivElementTabs(div({ name: 'Tabs' }))).toBe(true)
  expect(isHastMdxJsxFlowDivElementTabs(div({ name: 'TabItem', label: 'A0' }))).toBe(false)
  expect(isHastMdxJsxFlowDivElementTabItem(div({ name: 'TabItem', label: 'A0' }))).toBe(true)
  expect(isHastMdxJsxFlowDivElementTabItem(div({ name: 'TabItem' }))).toBe(false)
})

test('isHastRootDivElement still keys on the root marker', () => {
  expect(isHastRootDivElement(div({ root: 'true' }))).toBe(true)
  expect(isHastRootDivElement(div({ name: 'div' }))).toBe(false)
})
