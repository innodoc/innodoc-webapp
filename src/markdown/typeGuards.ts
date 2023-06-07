import type { Element } from 'hast'
import type { Root } from 'mdast'
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive'
import type { MdxJsxAttribute, MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx-jsx'
import { convert } from 'unist-util-is'

import type { MdxJsxFlowDivElement, MdxJsxTextSpanElement, RootDivElement } from '#types/markdown'

// TODO: remove unused, sort by ast type

// mdast

export const isRoot = convert<Root>('root')

export const isContainerDirective = convert<ContainerDirective>('containerDirective')
export const isLeafDirective = convert<LeafDirective>('leafDirective')
export const isTextDirective = convert<TextDirective>('textDirective')

export const isMdxJsxAttribute = convert<MdxJsxAttribute>('mdxJsxAttribute')
export const isMdxJsxFlowElement = convert<MdxJsxFlowElement>('mdxJsxFlowElement')
export const isMdxJsxTextElement = convert<MdxJsxTextElement>('mdxJsxTextElement')

// hast

export const isElement = convert<Element>('element')

export function isRootDivElement(node: Element): node is RootDivElement {
  return node.tagName === 'div' && node.properties?.root === 'true'
}

export function isMdxJsxFlowDivElement(node: Element): node is MdxJsxFlowDivElement {
  return node.tagName === 'div' && node.properties?.type === 'mdxJsxFlowElement'
}

export function isMdxJsxTextSpanElement(node: Element): node is MdxJsxTextSpanElement {
  return node.tagName === 'span' && node.properties?.type === 'mdxJsxTextElement'
}
