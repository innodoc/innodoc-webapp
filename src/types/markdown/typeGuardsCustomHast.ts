import { convertElement } from 'hast-util-is-element'

import type {
  HastMdxJsxFlowDivElement,
  HastMdxJsxFlowDivElementTabItem,
  HastMdxJsxFlowDivElementTabs,
  HastMdxJsxTextSpanElement,
  HastRootDivElement,
} from './hast'

export const isHastRootDivElement = convertElement(
  (el): el is HastRootDivElement => el.tagName === 'div' && el.properties?.root === 'true'
)

export const isHastMdxJsxFlowDivElement = convertElement(
  (el): el is HastMdxJsxFlowDivElement =>
    el.tagName === 'div' && el.properties?.type === 'mdxJsxFlowElement'
)

export const isHastMdxJsxTextSpanElement = convertElement(
  (el): el is HastMdxJsxTextSpanElement =>
    el.tagName === 'span' && el.properties?.type === 'mdxJsxTextElement'
)

export function isHastMdxJsxFlowDivElementTabs(el: unknown): el is HastMdxJsxFlowDivElementTabs {
  return isHastMdxJsxFlowDivElement(el) && el.properties.name === 'Tabs'
}

export function isHastMdxJsxFlowDivElementTabItem(
  el: unknown
): el is HastMdxJsxFlowDivElementTabItem {
  return (
    isHastMdxJsxFlowDivElement(el) &&
    el.properties.name === 'TabItem' &&
    typeof el.properties.label === 'string'
  )
}
