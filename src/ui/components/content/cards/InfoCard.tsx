import { useTranslation } from 'react-i18next'

// import useCardTitle from './useCardTitle'

import Card from './Card'
import type { ContentCardProps } from './types'

function InfoCard({ children }: ContentCardProps) {
  const { t } = useTranslation()
  // const title = useCardTitle(node.data?.id, t('content.info'))
  const title = t('content.info')

  // TODO id, title

  return (
    <Card cardType="info" iconName="mdi:information-outline" title={title}>
      {children}
    </Card>
  )
}

export default InfoCard
