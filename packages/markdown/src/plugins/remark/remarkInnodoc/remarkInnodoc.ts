import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import type { Node } from 'unist'

import numberCards from './numberCards'
import rewriteAppLinks from './rewriteAppLinks'

/** innoDoc specific remark plugin */
const remarkInnodoc: Plugin<[], Root> = () => {
  return (tree: Node) => {
    visit(tree, (node) => {
      rewriteAppLinks(node)
      numberCards(node)
    })
  }
}

export default remarkInnodoc
