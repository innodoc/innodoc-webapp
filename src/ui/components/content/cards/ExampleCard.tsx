import { useTranslation } from 'react-i18next'

import useCardTitle from '#ui/components/content/mdast/useCardTitle'

import Card from './Card'
import type { ContentCardProps } from './types'

function ExampleCard({ node }: ContentCardProps) {
  const { t } = useTranslation()
  const title = useCardTitle(node.data?.id, t('content.example'))

  // TODO id, title

  return <Card cardType="example" node={node} iconName="mdi:eye-outline" title={title} />
}

export default ExampleCard
