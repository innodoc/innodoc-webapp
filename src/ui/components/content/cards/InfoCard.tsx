import { useTranslation } from 'react-i18next'

import type { DivProps } from '#ui/components/content/ast/block/Div'
import { formatNumberedTitleElt } from '#utils/content'

import Card from './Card'

function InfoCard({ attributes, content, id }: DivProps) {
  const { t } = useTranslation()

  return (
    <Card
      cardType="info"
      content={content}
      iconName="mdi:information-outline"
      id={id}
      title={formatNumberedTitleElt(t('content.info'), attributes)}
    />
  )
}

export default InfoCard
