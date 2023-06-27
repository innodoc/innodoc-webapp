import type { Element } from 'hast'
import { convertElement } from 'hast-util-is-element'
import type { Root } from 'mdast'
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive'
import type { MdxJsxAttribute, MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx-jsx'
import { convert } from 'unist-util-is'

import type { MdxJsxFlowDivElement, MdxJsxTextSpanElement, RootDivElement } from '#types/markdown'

// mdast

export const isMdastRoot = convert<Root>('root')

export const isContainerDirective = convert<ContainerDirective>('containerDirective')
export const isLeafDirective = convert<LeafDirective>('leafDirective')
export const isTextDirective = convert<TextDirective>('textDirective')

export const isMdxJsxAttribute = convert<MdxJsxAttribute>('mdxJsxAttribute')
export const isMdxJsxFlowElement = convert<MdxJsxFlowElement>('mdxJsxFlowElement')
export const isMdxJsxTextElement = convert<MdxJsxTextElement>('mdxJsxTextElement')

// hast

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
