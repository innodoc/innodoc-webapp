import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import type { Node } from 'unist'
import { visit } from 'unist-util-visit'
import rewriteAppLinks from './rewrite-app-links.js'

function plugin(tree: Node) {
  visit(tree, (node) => {
    rewriteAppLinks(node)
  })
}

/** innoDoc specific remark plugin */
const remarkInnodoc: Plugin<[], Root> = () => {
  return plugin
}

export default remarkInnodoc
