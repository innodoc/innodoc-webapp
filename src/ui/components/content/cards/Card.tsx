import {
  Card as MuiCard,
  CardActionArea,
  CardContent,
  CardHeader,
  Collapse,
  styled,
} from '@mui/material'
import type { CardHeaderProps } from '@mui/material'
import type { Block } from 'pandoc-filter'
import { type ComponentProps, useState } from 'react'

import Icon, { type IconProps } from '#ui/components/common/Icon'
import ContentTree from '#ui/components/content/ast/ContentTree'

import type { CardType } from './types'

const ExpandIcon = styled(({ expand, ...other }: ExpandIconProps) => {
  return <Icon name="mdi:chevron-down" {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

type ExpandIconProps = Omit<IconProps, 'name'> & {
  expand: boolean
}

const StyledCardHeader = styled(
  ({ cardType, collapsible, dense, ...other }: StyledCardHeaderProps) => {
    return <CardHeader {...other} />
  }
)(({ cardType, collapsible, dense, theme }) => ({
  backgroundColor: theme.vars.palette.Card[cardType].header,
  color: theme.vars.palette.Card[cardType].color,
  cursor: collapsible ? 'pointer' : 'inherit',
  paddingBottom: dense ? theme.spacing(1) : undefined,
  paddingTop: dense ? theme.spacing(1) : undefined,
  '& > .MuiCardHeader-action': { marginTop: 0 },
}))

type StyledCardHeaderProps = CardHeaderProps & {
  cardType: CardType
  collapsible: boolean
  dense: boolean
}

function Card({
  cardType,
  content,
  collapsible = false,
  dense = false,
  elevation = 3,
  iconName,
  id,
  title,
}: CardProps) {
  const [expanded, setExpanded] = useState<boolean>(false)

  const handleExpandClick = () => {
    setExpanded((prev) => !prev)
  }

  const action = collapsible ? <ExpandIcon aria-expanded={expanded} expand={expanded} /> : undefined

  const cardHeader = (
    <StyledCardHeader
      action={action}
      avatar={iconName !== undefined ? <Icon name={iconName} /> : null}
      cardType={cardType}
      collapsible={collapsible}
      dense={dense}
      title={title}
      titleTypographyProps={{ variant: 'h4' }}
    />
  )

  const wrappedCardHeader = collapsible ? (
    <CardActionArea onClick={handleExpandClick}>{cardHeader}</CardActionArea>
  ) : (
    cardHeader
  )

  const cardContent = (
    <CardContent sx={{ py: 0, '&:last-child': { pb: 0 } }}>
      <ContentTree content={content} />
    </CardContent>
  )

  const wrappedCardContent = collapsible ? (
    <Collapse in={expanded} timeout="auto">
      {cardContent}
    </Collapse>
  ) : (
    cardContent
  )

  return (
    <MuiCard
      elevation={elevation}
      id={id}
      sx={{
        backgroundColor: (theme) => theme.vars.palette.Card[cardType].bg,
        my: 2,
      }}
    >
      {wrappedCardHeader}
      {wrappedCardContent}
    </MuiCard>
  )
}

type CardProps = Pick<ComponentProps<typeof MuiCard>, 'elevation' | 'sx'> & {
  cardType: CardType
  content: Block[]
  collapsible?: boolean
  dense?: boolean
  iconName?: IconProps['name']
  id?: string
  title: string
}

export default Card
