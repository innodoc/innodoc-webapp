import { useTranslation } from 'react-i18next'

import type { DivProps } from '@/ui/components/content/elt/block/Div'
import { formatNumberedTitleElt } from '@/utils/content'

import Card from './Card'

function InfoCard({ attributes, content, id }: DivProps) {
  const { t } = useTranslation()

  return (
    <Card
      title={formatNumberedTitleElt(t('content.info'), attributes)}
      cardType="info"
      iconName="mdi:information-outline"
      content={content}
      id={id}
    />
  )
}

export default InfoCard
