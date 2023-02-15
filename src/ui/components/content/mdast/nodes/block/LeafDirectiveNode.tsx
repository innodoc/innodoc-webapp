import type { LeafDirective } from 'mdast-util-directive'

function LeafDirectiveNode({ node }: LeafDirectiveNodeProps) {
  return null // TODO
}

interface LeafDirectiveNodeProps {
  node: LeafDirective
}

export default LeafDirectiveNode
