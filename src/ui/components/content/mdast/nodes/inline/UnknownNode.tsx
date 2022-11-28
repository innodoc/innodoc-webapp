import type { Node } from 'unist'

import InlineError from '#ui/components/common/error/InlineError'

function UnknownNode({ node }: UnknownNodeProps) {
  return <InlineError>Unknown inline element encountered: {node.type}</InlineError>
}

interface UnknownNodeProps {
  node: Node
}

export default UnknownNode
