import type { Root } from 'hast'
import type { Plugin } from 'unified'
import { isElement } from 'hast-util-is-element'
import { visit } from 'unist-util-visit'
import caption from './caption.js'
import tabs from './tabs.js'

function transformer(tree: Root) {
  visit(tree, (el) => {
    if (isElement(el)) {
      caption(el)
      tabs(el)
    }
  })
}

/** innoDoc specific rehype plugin */
const rehypeInnodoc: Plugin<[], Root, Root> = () => transformer

export default rehypeInnodoc
