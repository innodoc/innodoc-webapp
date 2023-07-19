import type { Node } from 'unist'

import { isMdastLink } from '#types/markdown/typeGuardsMdast'

/**
 * Rewrite 'app:route|param' link specifiers -> 'app://route|param'
 *
 * Change app links to URL-style protocol, so it can be easily whitelisted by
 * `rehype-sanitize`.
 */
function rewriteAppLinks(node: Node) {
  if (isMdastLink(node) && node.url.startsWith('app:')) {
    node.url = `app://${node.url.slice(4)}`
  }
}

export default rewriteAppLinks
