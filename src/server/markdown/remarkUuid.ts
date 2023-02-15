import { randomUUID } from 'crypto'

import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

/** Add UUID to every node */
const remarkUuid: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, (node) => {
      const uuid = randomUUID()
      node.data = 'data' in node ? { ...node.data, uuid } : { uuid }
    })
  }
}

export default remarkUuid
