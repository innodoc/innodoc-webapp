import type { ReactNode } from 'react'

const CARD_TYPES = ['example', 'exercise', 'hint', 'info', 'inputHint'] as const

type CardType = (typeof CARD_TYPES)[number]

function isCardType(cardType: unknown): cardType is CardType {
  return typeof cardType === 'string' && CARD_TYPES.includes(cardType as CardType)
}

interface ContentCardProps {
  children: ReactNode
  id?: string
}

export type { CardType, ContentCardProps }
export { CARD_TYPES, isCardType }
