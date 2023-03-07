import type { ContainerDirective } from 'mdast-util-directive'
import { Trans } from 'react-i18next'

import BlockError from '#ui/components/common/error/BlockError'
import ExampleCard from '#ui/components/content/cards/ExampleCard'
import ExerciseCard from '#ui/components/content/cards/ExerciseCard'
import HintCard from '#ui/components/content/cards/HintCard'
import InfoCard from '#ui/components/content/cards/InfoCard'
import InputHintCard from '#ui/components/content/cards/InputHintCard'

function ContainerDirectiveNode({ node }: ContainerDirectiveNodeProps) {
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
      <Trans
        i18nKey="error.unknownContainerDirective"
        components={{ 1: <code /> }}
        values={{ name: node.name }}
      >
        {`Unknown container directive name encountered: <1>{{name}}</1>`}
      </Trans>
    </BlockError>
  )
}

interface ContainerDirectiveNodeProps {
  node: ContainerDirective
}

export default ContainerDirectiveNode
