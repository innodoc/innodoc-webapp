import type { ContentCardProps } from './types.js'
import { useTranslation } from 'react-i18next'
// import useCardTitle from './useCardTitle.js'
import Card from './Card.js'

function ExampleCard({ children, id }: ContentCardProps) {
  const { t } = useTranslation()
  // const title = useCardTitle(node.data?.id, t('content.example'))
  const title = t('content.example')

  // TODO title

  return (
    <Card cardType="example" iconName="mdi:eye-outline" id={id} title={title}>
      {children}
    </Card>
  )
}

export default ExampleCard
