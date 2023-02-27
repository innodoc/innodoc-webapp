import type { InlineCode } from 'mdast'

import Code from '#ui/components/common/Code'

function InlineCodeNode({ node }: InlineCodeNodeProps) {
  return <Code>{node.value}</Code>
}

interface InlineCodeNodeProps {
  node: InlineCode
}

export default InlineCodeNode
