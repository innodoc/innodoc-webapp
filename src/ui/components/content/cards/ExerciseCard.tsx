import { useTranslation } from 'react-i18next'

import type { DivProps } from '@/ui/components/content/ast/block/Div'
import { formatNumberedTitleElt } from '@/utils/content'

import Card from './Card'

function ExerciseCard({ attributes, content, id }: DivProps) {
  const { t } = useTranslation()

  return (
    <Card
      cardType="exercise"
      content={content}
      iconName="mdi:application-edit-outline"
      id={id}
      title={formatNumberedTitleElt(t('content.exercise'), attributes)}
    />
  )
}

export default ExerciseCard
