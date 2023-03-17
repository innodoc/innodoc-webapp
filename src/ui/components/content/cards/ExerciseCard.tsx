import { useTranslation } from 'react-i18next'

// import useCardTitle from '#ui/components/content/mdast/useCardTitle'

import Card from './Card'
import type { ContentCardProps } from './types'

function ExerciseCard({ children }: ContentCardProps) {
  const { t } = useTranslation()
  // const title = useCardTitle(node.data?.id, t('content.exercise'))
  const title = t('content.exercise')

  // TODO id, title

  return (
    <Card cardType="exercise" iconName="mdi:application-edit-outline" title={title}>
      {children}
    </Card>
  )
}

export default ExerciseCard
