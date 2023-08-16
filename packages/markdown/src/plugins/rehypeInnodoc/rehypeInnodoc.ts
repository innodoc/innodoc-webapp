import { isElement } from 'hast-util-is-element'
import { visit } from 'unist-util-visit'
import type { Element } from 'hast'
import type { Plugin } from 'unified'

import caption from './caption'
import tabs from './tabs'

/** innoDoc specific rehype plugin */
const rehypeInnodoc: Plugin<[], Element> = () => {
  return function (tree) {
    visit(tree, (el) => {
      if (isElement(el)) {
        caption(el)
        tabs(el)
      }
    })
  }
}

export default rehypeInnodoc
