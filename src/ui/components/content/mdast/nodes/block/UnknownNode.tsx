import { useTranslation } from 'react-i18next'
import type { Node } from 'unist'

import BlockError from '#ui/components/common/error/BlockError'

function UnknownNode({ node }: UnknownNodeProps) {
  const { t } = useTranslation()

  return (
    <BlockError>
      {t('error.unknownBlockElement')}: <code>{node.type}</code>
    </BlockError>
  )
}

interface UnknownNodeProps {
  node: Node
}

export default UnknownNode
