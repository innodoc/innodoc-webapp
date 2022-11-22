import type { RowContent } from 'mdast'

import UnknownNode from './block/UnknownNode'

function RowContentNode({ node }: RowContentNodeProps) {
  return <UnknownNode node={node} />
}

type RowContentNodeProps = {
  node: RowContent
}

export default RowContentNode
