import type { Emphasis } from 'mdast'

import PhrasingContentNode from '#ui/components/content/mdast/nodes/PhrasingContentNode'

function EmphasisNode({ node }: EmphasisNodeProps) {
  return (
    <em>
      {node.children.map((child, idx) => (
        <PhrasingContentNode node={child} key={child?.data?.id ?? idx.toString()} />
      ))}
    </em>
  )
}

interface EmphasisNodeProps {
  node: Emphasis
}

export default EmphasisNode
