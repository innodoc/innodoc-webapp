import { h } from 'hastscript'
import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

import { isContainerDirective, isLeafDirective, isTextDirective } from '#markdown/typeGuards'

/** Directives to hast */
const remarkCustomDirectives: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, (node) => {
      if (isContainerDirective(node) || isLeafDirective(node) || isTextDirective(node)) {
        const tagName = node.type === 'textDirective' ? 'span' : 'div'
        const hast = h(tagName, {
          ...node.attributes,
          name: node.name,
          type: node.type,
        })
        node.data = node.data ?? {}
        node.data.hName = hast.tagName
        node.data.hProperties = hast.properties
      }
    })
  }
}

export default remarkCustomDirectives
