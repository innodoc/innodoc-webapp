import { useTranslation } from 'react-i18next'

import Card from './Card'
import type { ContentCardProps } from './types'

function InputHintCard({ node }: ContentCardProps) {
  const { t } = useTranslation()

  // TODO id, title

  return (
    <Card
      cardType="inputHint"
      node={node}
      dense
      elevation={1}
      iconName="mdi:keyboard-outline"
      title={t('content.inputHint')}
    />
  )
}

export default InputHintCard
