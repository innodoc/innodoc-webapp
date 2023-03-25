import type { Root } from 'hast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

/** Support tabs */
const rehypeTabs: Plugin<[], Root> = () => {
  return function (tree) {
    let tabIndex = 0

    // Add index property to tab items
    visit(tree, { tagName: 'div' }, (node) => {
      if (node?.properties?.type === 'containerDirective') {
        if (node?.properties?.name === 'tabs') {
          tabIndex = 0
        }

        if (node?.properties?.name === 'tab-item') {
          node.properties.index = (tabIndex++).toString()
        }
      }
    })
  }
}

export default rehypeTabs
