import type { HTML } from 'mdast'
import { Trans } from 'react-i18next'

import BlockError from '#ui/components/common/error/BlockError'

function HTMLNode({ node }: HTMLNodeProps) {
  // Ignore comments
  if (node.value.startsWith('<!--') && node.value.endsWith('-->')) {
    return null
  }

  return (
    <BlockError>
      <Trans
        i18nKey="error.unexpectedHtmlNode"
        components={{ 1: <code /> }}
        values={{ value: node.value }}
      >
        {`Unexpected HTML node encountered: <1>{{value}}</1>`}
      </Trans>
    </BlockError>
  )
}

interface HTMLNodeProps {
  node: HTML
}

export default HTMLNode
