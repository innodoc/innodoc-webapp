import type { MdxJsxAttribute } from 'mdast-util-mdx-jsx'
import type { Handlers } from 'mdast-util-to-hast'
import type { MdastNodes } from 'mdast-util-to-hast/lib'

import { isMdxJsxAttribute, isMdxJsxFlowElement, isMdxJsxTextElement } from '#markdown/typeGuards'

const remarkRehypeHandlers: Handlers = {
  // Annotate root element, so we can render as `React.Fragment`
  root: (state, node: MdastNodes) => {
    return {
      type: 'element',
      tagName: 'div',
      properties: { root: 'true' },
      children: state.all(node),
    }
  },

  mdxJsxFlowElement: (state, node) => {
    if (isMdxJsxFlowElement(node) && node.name !== null) {
      const attributes = node.attributes.filter((attr): attr is MdxJsxAttribute =>
        isMdxJsxAttribute(attr)
      )

      const properties = Object.fromEntries(
        attributes
          .filter((attr) => typeof attr.value === 'string')
          .map((attr) => [attr.name, attr.value]) as [string, string][]
      )

      return {
        type: 'element',
        tagName: 'div',
        properties: {
          ...properties,
          name: node.name,
          type: node.type,
        },
        children: state.all(node),
      }
    }
  },

  mdxJsxTextElement: (state, node) => {
    if (isMdxJsxTextElement(node) && node.name !== null) {
      const attributes = node.attributes.filter((attr): attr is MdxJsxAttribute =>
        isMdxJsxAttribute(attr)
      )

      const properties = Object.fromEntries(
        attributes
          .filter((attr) => typeof attr.value === 'string')
          .map((attr) => [attr.name, attr.value]) as [string, string][]
      )

      return {
        type: 'element',
        tagName: 'span',
        properties: {
          ...properties,
          name: node.name,
          type: node.type,
        },
        children: [],
      }
    }
  },
}

export default remarkRehypeHandlers
