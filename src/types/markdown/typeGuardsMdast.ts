import type { Link, Root } from 'mdast'
import type { MdxJsxAttribute, MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx-jsx'

import { isArbitraryObject } from '#types/typeGuards'

export function isMdastRoot(node: unknown): node is Root {
  return isArbitraryObject(node) && node.type === 'root'
}

export function isMdastLink(node: unknown): node is Link {
  return isArbitraryObject(node) && node.type === 'link'
}

export function isMdxJsxAttribute(node: unknown): node is MdxJsxAttribute {
  return isArbitraryObject(node) && node.type === 'mdxJsxAttribute'
}

export function isMdxJsxFlowElement(node: unknown): node is MdxJsxFlowElement {
  return isArbitraryObject(node) && node.type === 'mdxJsxFlowElement'
}

export function isMdxJsxTextElement(node: unknown): node is MdxJsxTextElement {
  return isArbitraryObject(node) && node.type === 'mdxJsxTextElement'
}
