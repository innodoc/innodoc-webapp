import type { Root } from 'hast'
import { h } from 'hastscript'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

import { isElement } from '#markdown/hastToReact/typeGuards'

// TODO how to do captions with MDX?

/** Support captions */
const rehypeCaption: Plugin<[], Root> = () => {
  return function (tree) {
    visit(tree, { tagName: 'div' }, (node) => {
      if (node?.properties?.name === 'table' && node.properties.type === 'containerDirective') {
        const [pChild, tableChild] = node.children

        if (
          isElement(pChild) &&
          isElement(tableChild) &&
          pChild.tagName === 'p' &&
          pChild.properties?.directiveLabel === 'true' &&
          tableChild.tagName === 'table'
        ) {
          // Put directiveLabel as <caption> where MUI table expects it
          node.children.splice(0, 1)
          tableChild.children.unshift(h('caption', undefined, pChild.children))
        }
      }
    })
  }
}

export default rehypeCaption
