import type { Content } from 'mdast'

import {
  isListContent,
  isPhrasingContent,
  isRowContent,
  isTableContent,
  isTopLevelContent,
} from '#ui/components/content/mdast/typeGuards'

import UnknownNode from './block/UnknownNode'
import ListContentNode from './ListContentNode'
import PhrasingContentNode from './PhrasingContentNode'
import RowContentNode from './RowContentNode'
import TableContentNode from './TableContentNode'
import TopLevelContentNode from './TopLevelContentNode'

// TODO remove unnecessary root elements?
function ContentNode({ node }: ContentNodeProps) {
  if (isTopLevelContent(node)) {
    return <TopLevelContentNode node={node} />
  }

  if (isListContent(node)) {
    return <ListContentNode node={node} />
  }

  if (isTableContent(node)) {
    return <TableContentNode node={node} />
  }

  if (isRowContent(node)) {
    return <RowContentNode node={node} />
  }

  if (isPhrasingContent(node)) {
    return <PhrasingContentNode node={node} />
  }

  return <UnknownNode node={node} />
}

interface ContentNodeProps {
  node: Content
}

export default ContentNode
