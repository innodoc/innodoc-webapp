import { useTranslation } from 'react-i18next'

import { formatNumberedTitleElt } from '#utils/content'

import Card from './Card'
import type { ContentCardProps } from './types'

function ExerciseCard({ content }: ContentCardProps) {
  const { t } = useTranslation()

  // TODO id, title

  return (
    <Card
      cardType="exercise"
      content={content}
      iconName="mdi:application-edit-outline"
      title={formatNumberedTitleElt(t('content.exercise'))}
    />
  )
}

export default ExerciseCard
