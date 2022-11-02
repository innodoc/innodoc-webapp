import { createElement, useEffect, useRef } from 'react'
import type { ElementNode } from 'svg-parser'

export function isElementNode(node: unknown): node is ElementNode {
  return node !== null && typeof node === 'object' && (node as ElementNode).type === 'element'
}

function SvgElementNode({
  node: { tagName, properties: { style, ...otherProperties } = {}, children },
}: SvgElementNodeProps) {
  // Need to set style attr as string val
  const ref = useRef<SVGPathElement>()
  useEffect(() => {
    if (ref.current !== undefined && typeof style === 'string') {
      ref.current.setAttribute('style', style)
    }
  }, [style])

  const a =
    tagName !== undefined
      ? createElement(
          tagName,
          { ...otherProperties, ref },
          children
            .filter(isElementNode)
            .map((node, idx) => <SvgElementNode key={idx} node={node} />)
        )
      : null

  return a
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
