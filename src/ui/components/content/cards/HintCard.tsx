import { useTranslation } from 'react-i18next'

import Card from './Card'
import type { ContentCardProps } from './types'

function HintCard({ node }: ContentCardProps) {
  const { t } = useTranslation()

  // TODO id, title

  return (
    <Card
      cardType="hint"
      collapsible
      node={node}
      dense
      elevation={1}
      iconName="mdi:lightbulb-outline"
      title={t('content.hint')}
    />
  )
}

export default HintCard
