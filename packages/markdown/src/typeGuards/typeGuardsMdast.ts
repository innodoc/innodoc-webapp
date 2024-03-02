import type { Link } from 'mdast'
import type { MdxJsxAttribute, MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx-jsx'

import { isArbitraryObject } from '@innodoc/utils/typeGuards'

function isMdastLink(node: unknown): node is Link {
  return isArbitraryObject(node) && node.type === 'link'
}

function isMdxJsxAttribute(node: unknown): node is MdxJsxAttribute {
  return isArbitraryObject(node) && node.type === 'mdxJsxAttribute'
}

function isMdxJsxFlowElement(node: unknown): node is MdxJsxFlowElement {
  return isArbitraryObject(node) && node.type === 'mdxJsxFlowElement'
}

function isMdxJsxTextElement(node: unknown): node is MdxJsxTextElement {
  return isArbitraryObject(node) && node.type === 'mdxJsxTextElement'
}

export { isMdastLink, isMdxJsxAttribute, isMdxJsxFlowElement, isMdxJsxTextElement }
