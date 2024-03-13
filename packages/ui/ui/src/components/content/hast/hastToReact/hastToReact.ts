import rehypeReact from 'rehype-react'
import { unified } from 'unified'
import type { Root } from 'hast'
import type { Options } from 'rehype-react'

import rehypeReactOptions from './rehypeReactOptions.js'
import rehypeReactOptionsDev from './rehypeReactOptionsDev.js'

let options: Options = rehypeReactOptions

if (import.meta.env.DEV) {
  options = rehypeReactOptionsDev
}

const processor = unified().use(rehypeReact, options)

/**
 * Unified processor (stringify phase)
 *
 * Transform hast to JSX elements.
 */
function hastToReact(hast: Root) {
  return processor.stringify(hast)
}

export default hastToReact
