import type { ContainerDirective } from 'mdast-util-directive'
import { useTranslation } from 'react-i18next'

import BlockError from '#ui/components/common/error/BlockError'
import ExampleCard from '#ui/components/content/cards/ExampleCard'
import ExerciseCard from '#ui/components/content/cards/ExerciseCard'
import HintCard from '#ui/components/content/cards/HintCard'
import InfoCard from '#ui/components/content/cards/InfoCard'
import InputHintCard from '#ui/components/content/cards/InputHintCard'

function ContainerDirectiveNode({ node }: ContainerDirectiveNodeProps) {
  const { t } = useTranslation()

  if (node.name === 'example') {
    return <ExampleCard node={node} />
  }

  if (node.name === 'exercise') {
    return <ExerciseCard node={node} />
  }

  if (node.name === 'hint') {
    return <HintCard node={node} />
  }

  if (node.name === 'info') {
    return <InfoCard node={node} />
  }

  if (node.name === 'inputHint') {
    return <InputHintCard node={node} />
  }

  return (
    <BlockError>
      {t('error.unknownContainerDirective')}: <code>{node.name}</code>
    </BlockError>
  )
}

interface ContainerDirectiveNodeProps {
  node: ContainerDirective
}

export default ContainerDirectiveNode
