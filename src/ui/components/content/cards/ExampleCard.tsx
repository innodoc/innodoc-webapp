import { useTranslation } from 'react-i18next'

import { formatNumberedTitleElt } from '#utils/content'

import Card from './Card'
import type { ContentCardProps } from './types'

function ExampleCard({ content }: ContentCardProps) {
  const { t } = useTranslation()

  // TODO id, title

  return (
    <Card
      cardType="example"
      content={content}
      iconName="mdi:eye-outline"
      title={formatNumberedTitleElt(t('content.example'))}
    />
  )
}

export default ExampleCard
