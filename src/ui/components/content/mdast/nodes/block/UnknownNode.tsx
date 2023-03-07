import { Trans } from 'react-i18next'
import type { Node } from 'unist'

import BlockError from '#ui/components/common/error/BlockError'

function UnknownNode({ node }: UnknownNodeProps) {
  return (
    <BlockError>
      <Trans
        i18nKey="error.unknownBlockElement"
        components={{ 1: <code /> }}
        values={{ type: node.type }}
      >
        {`Unknown block element encountered: <1>{{type}}</1>`}
      </Trans>
    </BlockError>
  )
}

interface UnknownNodeProps {
  node: Node
}

export default UnknownNode
