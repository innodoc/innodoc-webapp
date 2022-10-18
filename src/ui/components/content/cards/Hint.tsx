import { useTranslation } from 'react-i18next'

import type { DivProps } from '@/ui/components/content/ast/block/Div'
import { attributesToObject } from '@/utils/content'

import Card from './Card'

function Hint({ attributes, content, id }: DivProps) {
  const { t } = useTranslation()
  const attrsObj = attributesToObject(attributes)

  return (
    <Card
      cardType="hint"
      collapsible
      content={content}
      dense
      elevation={1}
      iconName="mdi:lightbulb-outline"
      id={id}
      title={attrsObj.caption ?? t('content.hint')}
    />
  )
}

export default Hint
