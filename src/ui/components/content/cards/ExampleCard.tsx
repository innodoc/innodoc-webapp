import { useTranslation } from 'react-i18next'

import type { DivProps } from '@/ui/components/content/elt/block/Div'
import { formatNumberedTitleElt } from '@/utils/content'

import Card from './Card'

function ExampleCard({ attributes, content, id }: DivProps) {
  const { t } = useTranslation()

  return (
    <Card
      title={formatNumberedTitleElt(t('content.example'), attributes)}
      cardType="example"
      iconName="mdi:eye-outline"
      content={content}
      id={id}
    />
  )
}

export default ExampleCard
