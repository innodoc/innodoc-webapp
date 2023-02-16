import { useTranslation } from 'react-i18next'

import useCardTitle from '#ui/components/content/mdast/useCardTitle'

import Card from './Card'
import type { ContentCardProps } from './types'

function InfoCard({ node }: ContentCardProps) {
  const { t } = useTranslation()
  const title = useCardTitle(node.data?.id, t('content.info'))

  // TODO id, title

  return <Card cardType="info" node={node} iconName="mdi:information-outline" title={title} />
}

export default InfoCard
