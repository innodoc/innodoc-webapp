import type { HTML } from 'mdast'
import { useTranslation } from 'react-i18next'

import BlockError from '#ui/components/common/error/BlockError'

function HTMLNode({ node }: HTMLNodeProps) {
  const { t } = useTranslation()

  return (
    <BlockError>
      {t('error.unexpectedHtmlNode')}: <code>{node.value}</code>
    </BlockError>
  )
}

interface HTMLNodeProps {
  node: HTML
}

export default HTMLNode
