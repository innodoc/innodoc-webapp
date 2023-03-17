import { useTranslation } from 'react-i18next'

import Card from './Card'
import type { ContentCardProps } from './types'

function InputHintCard({ children }: ContentCardProps) {
  const { t } = useTranslation()

  // TODO id, title

  return (
    <Card
      cardType="inputHint"
      dense
      elevation={1}
      iconName="mdi:keyboard-outline"
      title={t('content.inputHint')}
    >
      {children}
    </Card>
  )
}

export default InputHintCard
