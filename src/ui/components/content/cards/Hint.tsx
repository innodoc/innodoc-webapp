import { useTranslation } from 'react-i18next'

import Card from './Card'
import type { ContentCardProps } from './types'

function Hint({ content }: ContentCardProps) {
  const { t } = useTranslation()

  // TODO id, title

  return (
    <Card
      cardType="hint"
      collapsible
      content={content}
      dense
      elevation={1}
      iconName="mdi:lightbulb-outline"
      title={t('content.hint')}
    />
  )
}

export default Hint
