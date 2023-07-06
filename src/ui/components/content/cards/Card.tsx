import {
  Card as MuiCard,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  styled,
} from '@mui/material'
import type { CardHeaderProps } from '@mui/material'
import { type ComponentProps, useState, type ReactNode } from 'react'

import Icon, { type IconProps } from '#ui/components/common/Icon'

import type { CardType, ContentCardProps } from './types'

const ExpandIcon = styled(Icon, {
  shouldForwardProp: (prop) => prop !== 'expand',
})<ExpandIconProps>(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

interface ExpandIconProps extends Omit<IconProps, 'name'> {
  expand: boolean
}

const StyledCardHeader = styled(CardHeader, {
  shouldForwardProp: (prop) => !['cardType', 'collapsible', 'dense'].includes(prop.toString()),
})<StyledCardHeaderProps>(({ cardType, collapsible, dense, theme }) => ({
  backgroundColor: theme.vars.palette.Card[cardType].header,
  color: theme.vars.palette.Card[cardType].color,
  cursor: collapsible ? 'pointer' : 'inherit',
  paddingBottom: dense ? theme.spacing(1) : undefined,
  paddingTop: dense ? theme.spacing(1) : undefined,
  '& > .MuiCardHeader-action': { marginTop: 0 },
}))

interface StyledCardHeaderProps extends CardHeaderProps {
  cardType: CardType
  collapsible: boolean
  dense: boolean
}

function Card({
  actions,
  cardType,
  children,
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

  const action = collapsible ? (
    <ExpandIcon aria-expanded={expanded} name="mdi:chevron-down" expand={expanded} />
  ) : undefined

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
    <CardContent sx={{ py: 0, '&:last-child': { pb: 0 } }}>{children}</CardContent>
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
      {actions ? <CardActions disableSpacing>{actions}</CardActions> : null}
    </MuiCard>
  )
}

interface CardProps
  extends ContentCardProps,
    Pick<ComponentProps<typeof MuiCard>, 'elevation' | 'sx'> {
  actions?: ReactNode
  cardType: CardType
  collapsible?: boolean
  dense?: boolean
  iconName?: IconProps['name']
  id?: string
  title: string
}

export default Card
