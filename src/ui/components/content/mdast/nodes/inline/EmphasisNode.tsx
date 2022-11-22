import type { Emphasis } from 'mdast'

import PhrasingContentNode from '#ui/components/content/mdast/nodes/PhrasingContentNode'

function EmphasisNode({ node }: EmphasisNodeProps) {
  return (
    <em>
      {node.children.map((child, idx) => (
        <PhrasingContentNode node={child} key={idx.toString()} />
      ))}
    </em>
  )
}

type EmphasisNodeProps = {
  node: Emphasis
}

export default EmphasisNode
