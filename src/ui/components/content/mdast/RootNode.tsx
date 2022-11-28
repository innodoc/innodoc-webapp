import type { Root } from 'mdast'

import ContentNode from './nodes/ContentNode'

function RootNode({ node }: RootProps) {
  return (
    <>
      {node.children.map((child, idx) => (
        <ContentNode node={child} key={idx.toString()} />
      ))}
    </>
  )
}

interface RootProps {
  node: Root
}

export default RootNode
