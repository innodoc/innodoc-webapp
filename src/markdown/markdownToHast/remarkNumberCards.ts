import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

// TODO

/** Number cards within one section */
const remarkNumberCards: Plugin<[], Root> = () => {
  return (tree) => {
    // let ordinal = 0

    visit(tree, (node) => {
      // if (isContainerDirective(node)) {
      //   node.data = 'data' in node ? { ...node.data, ordinal } : { ordinal }
      // }
      // ordinal += 1
    })
  }
}

export default remarkNumberCards
