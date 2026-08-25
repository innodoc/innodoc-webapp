import type { Link, Root } from 'mdast'
import type { MdxJsxAttribute, MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx-jsx'
import { isArbitraryObject } from './common.js'

/** Type guard for mdast `Root` */
function isMdastRoot(node: unknown): node is Root {
  return isArbitraryObject(node) && node.type === 'root'
}

/** Type guard for mdast `Link` */
function isMdastLink(node: unknown): node is Link {
  return isArbitraryObject(node) && node.type === 'link'
}

/** Type guard for `MdxJsxAttribute` */
function isMdxJsxAttribute(node: unknown): node is MdxJsxAttribute {
  return isArbitraryObject(node) && node.type === 'mdxJsxAttribute'
}

/** Type guard for `MdxJsxFlowElement` */
function isMdxJsxFlowElement(node: unknown): node is MdxJsxFlowElement {
  return isArbitraryObject(node) && node.type === 'mdxJsxFlowElement'
}

/** Type guard for `MdxJsxTextElement` */
function isMdxJsxTextElement(node: unknown): node is MdxJsxTextElement {
  return isArbitraryObject(node) && node.type === 'mdxJsxTextElement'
}

export { isMdastLink, isMdastRoot, isMdxJsxAttribute, isMdxJsxFlowElement, isMdxJsxTextElement }
