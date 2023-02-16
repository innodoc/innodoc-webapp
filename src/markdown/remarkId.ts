import type { Root } from 'mdast'
import { nanoid } from 'nanoid'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

/** Add ID to every node */
const remarkId: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, (node) => {
      const id = nanoid()
      node.data = 'data' in node ? { ...node.data, id } : { id }
    })
  }
}

export default remarkId
