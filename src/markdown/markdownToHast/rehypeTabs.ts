import type { Root } from 'hast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

import { isMdxJsxFlowElementHast } from './typeGuards'

/** Support tabs */
const rehypeTabs: Plugin<[], Root> = () => {
  return function (tree) {
    // let tabIndex = 0

    visit(tree, (node) => {
      if (isMdxJsxFlowElementHast(node)) {
        // Add tab labels to tabs
        // if (node.properties.name === 'Tabs') {
        //   tabIndex = 0
        //   node.properties.labels = []
        //   for (const child of node.children) {
        //     if (
        //       isMdxJsxFlowElementHast(child) &&
        //       child.properties.name === 'TabItem' &&
        //       typeof child.properties.label === 'string'
        //     ) {
        //       node.properties.labels.push(child.properties.label)
        //     }
        //   }
        // }
        // // Add index property to tab items
        // if (node.properties.name === 'TabItem') {
        //   node.properties.index = (tabIndex++).toString()
        // }
      }
    })
  }
}

export default rehypeTabs
