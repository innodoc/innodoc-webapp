import { useTranslation } from 'react-i18next'

import Card from './Card'
import type { ContentCardProps } from './types'

function InputHintCard({ children, id }: ContentCardProps) {
  const { t } = useTranslation()

  // TODO title

  return (
    <Card
      cardType="inputHint"
      dense
      elevation={1}
      iconName="mdi:keyboard-outline"
      id={id}
      title={t('content.inputHint')}
    >
      {children}
    </Card>
  )
}

export default InputHintCard
