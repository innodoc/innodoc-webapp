import { Card as MuiCard, CardContent, CardHeader } from '@mui/material'
import type { Block } from 'pandoc-filter'

import Icon, { type IconProps } from '@/ui/components/common/Icon'
import ContentTree from '@/ui/components/content/ContentTree'

import type { CardType } from './types'

function Card({ cardType, content, iconName, id, title }: CardProps) {
  return (
    <MuiCard
      id={id}
      sx={(theme) => ({
        backgroundColor: theme.vars.palette.Card[cardType].bg,
        my: 2,
      })}
      elevation={3}
    >
      <CardHeader
        avatar={iconName !== undefined ? <Icon name={iconName} /> : null}
        sx={(theme) => ({
          backgroundColor: theme.vars.palette.Card[cardType].header,
          color: theme.vars.palette.Card[cardType].color,
        })}
        title={title}
        titleTypographyProps={{ variant: 'h4' }}
      />
      <CardContent sx={{ py: 0, '&:last-child': { pb: 0 } }}>
        <ContentTree content={content} />
      </CardContent>
    </MuiCard>
  )
}

type CardProps = {
  cardType: CardType
  content: Block[]
  iconName?: IconProps['name']
  id?: string
  title: string
}

export default Card
