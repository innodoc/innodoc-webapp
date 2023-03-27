import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

/**
 * Rewrite 'app:route|param' link specifiers -> 'app://route|param'
 *
 * Change app links to URL-style protocol, so it can be easily whitelisted by
 * `rehype-sanitize`.
 */
const remarkRewriteAppLinks: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === 'link' && node.url.startsWith('app:')) {
        node.url = `app://${node.url.slice(4)}`
      }
    })
  }
}

export default remarkRewriteAppLinks
