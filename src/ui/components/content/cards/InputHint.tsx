import { useTranslation } from 'react-i18next'

import type { DivProps } from '#ui/components/content/ast/block/Div'

import Card from './Card'

function InputHint({ content, id }: DivProps) {
  const { t } = useTranslation()

  return (
    <Card
      cardType="inputHint"
      content={content}
      dense
      elevation={1}
      iconName="mdi:keyboard-outline"
      id={id}
      title={t('content.inputHint')}
    />
  )
}

export default InputHint
