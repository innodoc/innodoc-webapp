import type { Delete } from 'mdast'

import PhrasingContentNode from '#ui/components/content/mdast/nodes/PhrasingContentNode'

function DeleteNode({ node }: DeleteNodeProps) {
  return (
    <s>
      {node.children.map((child, idx) => (
        <PhrasingContentNode node={child} key={child?.data?.uuid ?? idx.toString()} />
      ))}
    </s>
  )
}

interface DeleteNodeProps {
  node: Delete
}

export default DeleteNode
