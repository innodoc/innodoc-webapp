import type { Nodes } from 'mdast'
import type { MdxJsxAttribute } from 'mdast-util-mdx-jsx'
import type { Handlers } from 'mdast-util-to-hast'
import { isMdxJsxAttribute, isMdxJsxFlowElement, isMdxJsxTextElement } from '#typeguards'

const remarkRehypeHandlers: Handlers = {
  // Annotate root element, so we can render as `React.Fragment`
  root: (state, node: Nodes) => ({
    type: 'element',
    tagName: 'div',
    properties: { root: 'true' },
    children: state.all(node),
  }),

  // Turn MdxJsxFlowElement to `div`
  mdxJsxFlowElement: (state, node) => {
    if (!isMdxJsxFlowElement(node)) {
      return
    }

    // A null-named element is a JSX fragment: flatten its converted children into the parent
    // (`mdast-util-to-hast`'s `state.all` spreads array results).
    if (node.name === null) {
      return state.all(node)
    }

    const attributes = node.attributes.filter((attr): attr is MdxJsxAttribute => isMdxJsxAttribute(attr))

    const properties = Object.fromEntries(
      attributes.filter((attr) => typeof attr.value === 'string').map((attr) => [attr.name, attr.value]) as [
        string,
        string,
      ][],
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
  },

  // Turn MdxJsxTextElement to `span`
  mdxJsxTextElement: (state, node) => {
    if (!isMdxJsxTextElement(node)) {
      return
    }

    // A null-named element is a JSX fragment: flatten its converted children into the parent
    // (`mdast-util-to-hast`'s `state.all` spreads array results).
    if (node.name === null) {
      return state.all(node)
    }

    const attributes = node.attributes.filter((attr): attr is MdxJsxAttribute => isMdxJsxAttribute(attr))

    const properties = Object.fromEntries(
      attributes.filter((attr) => typeof attr.value === 'string').map((attr) => [attr.name, attr.value]) as [
        string,
        string,
      ][],
    )

    return {
      type: 'element',
      tagName: 'span',
      properties: {
        ...properties,
        name: node.name,
        type: node.type,
      },
      children: state.all(node),
    }
  },
}

export default remarkRehypeHandlers
