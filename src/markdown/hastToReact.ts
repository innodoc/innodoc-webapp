import type { Root } from 'hast'
import { createElement, Fragment } from 'react'
import rehypeReact from 'rehype-react'
import rehypeSlug from 'rehype-slug'
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
    // TODO: should wrap root with Fragment, but doesn't work when components.div is specified
    // https://github.com/rehypejs/rehype-react/issues/36
    Fragment,
    passNode: true,
  })
  .use(rehypeSlug)
  .freeze()

function hastToReact(hast: Root) {
  return processor.stringify(hast)
}

export default hastToReact
