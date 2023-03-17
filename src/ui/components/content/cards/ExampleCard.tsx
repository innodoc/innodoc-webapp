import { useTranslation } from 'react-i18next'

// import useCardTitle from './useCardTitle'

import Card from './Card'
import type { ContentCardProps } from './types'

function ExampleCard({ children }: ContentCardProps) {
  const { t } = useTranslation()
  // const title = useCardTitle(node.data?.id, t('content.example'))
  const title = t('content.example')

  // TODO id, title

  return (
    <Card cardType="example" iconName="mdi:eye-outline" title={title}>
      {children}
    </Card>
  )
}

export default ExampleCard
