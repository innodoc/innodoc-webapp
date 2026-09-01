import type { Node } from 'unist'
import { isMdastLink } from '#typeguards'

/**
 * Rewrite 'app:route|param' link specifiers -> 'app://route|param'
 *
 * Change app links to URL-style protocol, so it can be easily whitelisted by
 * `rehype-sanitize`. Idempotent: urls that already carry the `app://` form are
 * left alone, so re-applying the transform (a re-visited or re-parsed tree)
 * is a no-op instead of double-prefixing to `app:////...`.
 */
function rewriteAppLinks(node: Node) {
  if (isMdastLink(node) && node.url.startsWith('app:') && !node.url.startsWith('app://')) {
    node.url = `app://${node.url.slice(4)}`
  }
}

export default rewriteAppLinks
