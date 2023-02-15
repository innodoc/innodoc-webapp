import type { Strong } from 'mdast'

import PhrasingContentNode from '#ui/components/content/mdast/nodes/PhrasingContentNode'

function StrongNode({ node }: StrongNodeProps) {
  return (
    <strong>
      {node.children.map((child, idx) => (
        <PhrasingContentNode node={child} key={child?.data?.uuid ?? idx.toString()} />
      ))}
    </strong>
  )
}

interface StrongNodeProps {
  node: Strong
}

export default StrongNode
