import type { Root } from 'hast'
import type { Options } from 'rehype-react'
import rehypeReact from 'rehype-react'
import { unified } from 'unified'
import rehypeReactOptionsDev from './rehype-react-options-dev.js'
import rehypeReactOptions from './rehype-react-options.js'

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
