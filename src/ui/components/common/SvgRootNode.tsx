import { type ComponentType, createElement, type SVGProps } from 'react'
import { useTranslation } from 'react-i18next'
import type { ElementNode, RootNode } from 'svg-parser'

import InlineError from '#ui/components/common/error/InlineError'
import attributesToProps from '#utils/attributesToProps'

function isElementNode(node: unknown): node is ElementNode {
  if (node === null || typeof node !== 'object') return false
  const elementNode = node as ElementNode
  return elementNode.type === 'element' && Array.isArray(elementNode.children)
}

function isRootNode(node: unknown): node is RootNode {
  if (node === null || typeof node !== 'object') return false
  const rootNode = node as RootNode
  return (
    rootNode.type === 'root' && Array.isArray(rootNode.children) && rootNode.children.length === 1
  )
}

function SvgElementNode({ node: { tagName, properties = {}, children } }: SvgElementNodeProps) {
  return tagName !== undefined
    ? createElement(
        tagName,
        attributesToProps(properties),
        children.filter(isElementNode).map((node, idx) => <SvgElementNode key={idx} node={node} />)
      )
    : null
}

interface SvgElementNodeProps {
  node: ElementNode
}

function SvgNode({ node }: SvgNodeProps) {
  if (typeof node === 'string') return <>{node}</>
  if (isElementNode(node)) return <SvgElementNode node={node} />
  if (node.value === undefined) return null // TextNode

  return <>{node.value}</>
}

interface SvgNodeProps {
  node: ElementNode['children'][number]
}

function SvgRootNode({ component: Component, rootNode, ...props }: SvgRootNodeProps) {
  const { t } = useTranslation()

  if (!isRootNode(rootNode)) {
    return <InlineError>{t('error.invalidSvgRoot')}</InlineError>
  }

  const svgNode = rootNode.children[0]
  if (!isElementNode(svgNode)) {
    return <InlineError>{t('error.invalidSvgRoot')}</InlineError>
  }

  const svgProps = attributesToProps(svgNode.properties)

  const children = svgNode.children
    .map((node, idx) => {
      return isElementNode(node) ? <SvgNode key={idx} node={node} /> : false
    })
    .filter(Boolean)

  return (
    <Component {...svgProps} {...props}>
      {children}
    </Component>
  )
}

interface SvgRootNodeProps extends SVGProps<SVGSVGElement> {
  component: ComponentType | string
  rootNode: unknown
}

export default SvgRootNode
