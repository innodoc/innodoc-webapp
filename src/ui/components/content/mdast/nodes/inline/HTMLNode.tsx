import type { HTML } from 'mdast'
import { useTranslation } from 'react-i18next'

import InlineError from '#ui/components/common/error/InlineError'

function HTMLNode({ node }: HTMLNodeProps) {
  const { t } = useTranslation()

  return (
    <InlineError>
      {t('error.unexpectedHtmlNode')}: <code>{node.value}</code>
    </InlineError>
  )
}

interface HTMLNodeProps {
  node: HTML
}

export default HTMLNode
