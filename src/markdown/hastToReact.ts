import { createElement } from 'react'
import rehypeReact from 'rehype-react'
import { unified } from 'unified'

import componentsMap from '#ui/components/content/markdown/componentsMap'

import type { HastRoot } from './markdownToHast/markdownToHast'

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

function hastToReact(hast: HastRoot) {
  return processor.stringify(hast)
}

export default hastToReact
