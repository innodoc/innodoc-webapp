import { createElement } from 'react'
import type { ElementNode } from 'svg-parser'

export function isElementNode(node: unknown): node is ElementNode {
  return node !== null && typeof node === 'object' && (node as ElementNode).type === 'element'
}

function SvgElementNode({ node: { tagName, properties = {}, children } }: SvgElementNodeProps) {
  return tagName !== undefined
    ? createElement(
        tagName,
        properties,
        children.filter(isElementNode).map((node, idx) => <SvgElementNode key={idx} node={node} />)
      )
    : null
}

type SvgElementNodeProps = {
  node: ElementNode
}

function SvgNode({ node }: SvgNodeProps) {
  if (typeof node === 'string') {
    return <>{node}</>
  }

  if (isElementNode(node)) {
    return <SvgElementNode node={node} />
  }

  // TextNode
  if (node.value === undefined) return null
  return <>{node.value}</>
}

type SvgNodeProps = {
  node: ElementNode['children'][number]
}

export default SvgNode
