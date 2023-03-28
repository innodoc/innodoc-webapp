import { useTranslation } from 'react-i18next'

import Card from './Card'
import type { ContentCardProps } from './types'

function HintCard({ children, id }: ContentCardProps) {
  const { t } = useTranslation()

  // TODO title

  return (
    <Card
      cardType="hint"
      dense
      elevation={1}
      iconName="mdi:lightbulb-outline"
      id={id}
      title={t('content.hint')}
    >
      {children}
    </Card>
  )
}

export default HintCard
