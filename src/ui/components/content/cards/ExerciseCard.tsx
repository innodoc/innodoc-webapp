import { useTranslation } from 'react-i18next'

import useCardTitle from '#ui/components/content/mdast/useCardTitle'

import Card from './Card'
import type { ContentCardProps } from './types'

function ExerciseCard({ node }: ContentCardProps) {
  const { t } = useTranslation()
  const title = useCardTitle(node.data?.uuid, t('content.exercise'))

  // TODO id, title

  return (
    <Card cardType="exercise" node={node} iconName="mdi:application-edit-outline" title={title} />
  )
}

export default ExerciseCard
