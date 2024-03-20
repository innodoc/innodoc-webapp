import type { ReactNode } from 'react'

import type { CARD_TYPES } from './Card.js'

type CardType = (typeof CARD_TYPES)[number]

interface ContentCardProps {
  children: ReactNode
  id?: string
}

export type { CardType, ContentCardProps }
