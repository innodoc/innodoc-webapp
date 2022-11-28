import type { HTML } from 'mdast'

import BlockError from '#ui/components/common/error/BlockError'

function HTMLNode({ node }: HTMLNodeProps) {
  return (
    <BlockError>
      Unexpected HTML node encountered: <code>{node.value}</code>
    </BlockError>
  )
}

interface HTMLNodeProps {
  node: HTML
}

export default HTMLNode
