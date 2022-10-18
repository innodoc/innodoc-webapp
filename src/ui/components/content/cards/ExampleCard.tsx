import { useTranslation } from 'react-i18next'

import type { DivProps } from '@/ui/components/content/ast/block/Div'
import { formatNumberedTitleElt } from '@/utils/content'

import Card from './Card'

function ExampleCard({ attributes, content, id }: DivProps) {
  const { t } = useTranslation()

  return (
    <Card
      cardType="example"
      content={content}
      iconName="mdi:eye-outline"
      id={id}
      title={formatNumberedTitleElt(t('content.example'), attributes)}
    />
  )
}

export default ExampleCard
