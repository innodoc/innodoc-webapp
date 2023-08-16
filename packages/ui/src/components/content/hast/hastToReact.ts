import { createElement } from 'react'
import rehypeReact from 'rehype-react'
import { unified } from 'unified'
import type { Root } from 'hast'

import componentsMap from './componentsMap'

/**
 * Unified processor (stringify phase)
 *
 * Transform hast to JSX elements.
 */
const processor = unified().use(rehypeReact, {
  components: componentsMap,
  createElement,
  passNode: true,
})

function hastToReact(hast: Root) {
  return processor.stringify(hast)
}

export default hastToReact
