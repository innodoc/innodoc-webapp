import { useTranslation } from 'react-i18next'

import Card from './Card'
import type { ContentCardProps } from './types'

function SolutionCard({ children, id }: ContentCardProps) {
  const { t } = useTranslation()

  // TODO title

  return (
    <Card
      cardType="hint"
      collapsible
      dense
      elevation={1}
      iconName="mdi:lightbulb-outline"
      id={id}
      title={t('content.solution')}
    >
      {children}
    </Card>
  )
}

export default SolutionCard
