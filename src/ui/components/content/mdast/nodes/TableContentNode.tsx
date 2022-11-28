import type { TableContent } from 'mdast'

import { isTableRow } from '#ui/components/content/mdast/typeGuards'

import TableRowNode from './block/TableRowNode'
import UnknownNode from './block/UnknownNode'

function TableContentNode({ node }: TableContentNodeProps) {
  if (isTableRow(node)) {
    return <TableRowNode node={node} />
  }

  return <UnknownNode node={node} />
}

interface TableContentNodeProps {
  node: TableContent
}

export default TableContentNode
