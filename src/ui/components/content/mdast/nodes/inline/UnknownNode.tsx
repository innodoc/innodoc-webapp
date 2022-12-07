import { useTranslation } from 'react-i18next'
import type { Node } from 'unist'

import InlineError from '#ui/components/common/error/InlineError'

function UnknownNode({ node }: UnknownNodeProps) {
  const { t } = useTranslation()

  return (
    <InlineError>
      {t('error.unknownInlineElement')}: <code>{node.type}</code>
    </InlineError>
  )
}

interface UnknownNodeProps {
  node: Node
}

export default UnknownNode
