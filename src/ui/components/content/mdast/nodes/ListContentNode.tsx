import type { ListContent } from 'mdast'

import { isListItem } from '#ui/components/content/mdast/typeGuards'

import ListItemNode from './block/ListItemNode'
import UnknownNode from './block/UnknownNode'

function ListContentNode({ node }: ListContentNodeProps) {
  if (isListItem(node)) {
    return <ListItemNode node={node} />
  }

  return <UnknownNode node={node} />
}

type ListContentNodeProps = {
  node: ListContent
}

export default ListContentNode
