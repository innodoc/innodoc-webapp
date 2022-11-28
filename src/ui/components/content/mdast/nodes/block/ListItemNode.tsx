import type { ListItem } from 'mdast'

import BlockContentNode from '#ui/components/content/mdast/nodes/BlockContentNode'
import { isBlockContent } from '#ui/components/content/mdast/typeGuards'

function ListItemNode({ node }: ListItemNodeProps) {
  const children = node.children.map((child, i) =>
    isBlockContent(child) ? <BlockContentNode key={i.toString()} node={child} /> : null
  )

  return <li>{children}</li>
}

interface ListItemNodeProps {
  node: ListItem
}

export default ListItemNode
