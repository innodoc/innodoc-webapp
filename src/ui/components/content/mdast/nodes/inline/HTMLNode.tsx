import type { HTML } from 'mdast'
import { Trans } from 'react-i18next'

import InlineError from '#ui/components/common/error/InlineError'

function HTMLNode({ node }: HTMLNodeProps) {
  return (
    <InlineError>
      <Trans
        i18nKey="error.unexpectedHtmlNode"
        components={{ 1: <code /> }}
        values={{ type: node.value }}
      >
        {`Unexpected HTML node encountered: <1>{{value}}</1>`}
      </Trans>
    </InlineError>
  )
}

interface HTMLNodeProps {
  node: HTML
}

export default HTMLNode
