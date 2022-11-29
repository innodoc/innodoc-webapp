import { useTranslation } from 'react-i18next'

import { formatNumberedTitleElt } from '#utils/content'

import Card from './Card'
import type { ContentCardProps } from './types'

function InfoCard({ content }: ContentCardProps) {
  const { t } = useTranslation()

  // TODO id, title

  return (
    <Card
      cardType="info"
      content={content}
      iconName="mdi:information-outline"
      title={formatNumberedTitleElt(t('content.info'))}
    />
  )
}

export default InfoCard
