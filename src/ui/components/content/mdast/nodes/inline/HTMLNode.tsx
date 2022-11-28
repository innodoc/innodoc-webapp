import type { HTML } from 'mdast'

import InlineError from '#ui/components/common/error/InlineError'

function HTMLNode({ node }: HTMLNodeProps) {
  return (
    <InlineError>
      Unexpected HTML node encountered: <code>{node.value}</code>
    </InlineError>
  )
}

interface HTMLNodeProps {
  node: HTML
}

export default HTMLNode
