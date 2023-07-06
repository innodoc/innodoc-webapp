import type { Element } from 'hast'
import { convertElement } from 'hast-util-is-element'
import { convert } from 'unist-util-is'

import type { MdxJsxFlowDivElement, MdxJsxTextSpanElement, RootDivElement } from '#types/markdown'

export const isElement = convert<Element>('element')

export const isRootDivElement = convertElement(
  (el): el is RootDivElement => el.tagName === 'div' && el.properties?.root === 'true'
)

export const isMdxJsxFlowDivElement = convertElement(
  (el): el is MdxJsxFlowDivElement =>
    el.tagName === 'div' && el.properties?.type === 'mdxJsxFlowElement'
)

export const isMdxJsxTextSpanElement = convertElement(
  (el): el is MdxJsxTextSpanElement =>
    el.tagName === 'span' && el.properties?.type === 'mdxJsxTextElement'
)
