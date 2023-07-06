import type { Root } from 'hast'
import { createElement } from 'react'
import rehypeReact from 'rehype-react'
import { unified } from 'unified'

import componentsMap from '#ui/components/content/markdown/componentsMap'

/**
 * Unified processor (stringify phase)
 *
 * Transform hast to JSX elements.
 */
const processor = unified()
  .use(rehypeReact, {
    components: componentsMap,
    createElement,
    passNode: true,
  })
  .freeze()

function hastToReact(hast: Root) {
  return processor.stringify(hast)
}

export default hastToReact
