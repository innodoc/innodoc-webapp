import type { Node } from 'unist'

import BlockError from '#ui/components/common/error/BlockError'

function UnknownNode({ node }: UnknownNodeProps) {
  return <BlockError>Unknown block element encountered: {node.type}</BlockError>
}

interface UnknownNodeProps {
  node: Node
}

export default UnknownNode
