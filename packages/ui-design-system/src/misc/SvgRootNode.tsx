// TODO: use hast-util-from-html/hast-util-to-jsx-runtime

import type { ComponentType, SVGProps } from 'react'
import type { ElementNode, RootNode } from 'svg-parser'
import { createElement } from 'react'
import { useTranslation } from 'react-i18next'
import { InlineError } from '#errors'
import attributesToProps from './attributes-to-props.js'

function generateNodeKey(node: ElementNode, index: number): string {
  const tagName = node.tagName ?? 'unknown'

  // Use a ID property if it exists
  const id = node.properties?.id
  if (id) {
    return `node-${tagName}-${String(id)}`
  }

  // Fallback: Create a hash-like string from tagName and a few key properties
  const className = node.properties?.className ?? ''

  // We include the index at the end to ensure uniqueness within the list,
  // but prefixing it with content makes it more stable than just "idx"
  return `${tagName}-${String(className)}-${String(index)}`
}

function isElementNode(node: unknown): node is ElementNode {
  if (node === null || typeof node !== 'object') {
    return false
  }
  const elementNode = node as { children: unknown; type: unknown }
  return elementNode.type === 'element' && Array.isArray(elementNode.children)
}

function isRootNode(node: unknown): node is RootNode {
  if (node === null || typeof node !== 'object') {
    return false
  }
  const rootNode = node as { children: unknown; type: unknown }
  return rootNode.type === 'root' && Array.isArray(rootNode.children) && rootNode.children.length === 1
}

function SvgElementNode({ node: { tagName, properties = {}, children } }: SvgElementNodeProps) {
  if (!tagName) {
    return null
  }

  return createElement(
    tagName,
    attributesToProps(properties),
    children
      .filter((c) => isElementNode(c))
      .map((node, idx) => <SvgElementNode key={generateNodeKey(node, idx)} node={node} />),
  )
}

interface SvgElementNodeProps {
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
  if (node.value === undefined) {
    return null
  }

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
    .map((node, idx) => (isElementNode(node) ? <SvgNode key={generateNodeKey(node, idx)} node={node} /> : false))
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
