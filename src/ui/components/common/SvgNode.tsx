import { createElement } from 'react'
import type { ElementNode, Node } from 'svg-parser'

export function isElementNode(node: string | Node): node is ElementNode {
  return typeof node !== 'string' && node.type === 'element'
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
