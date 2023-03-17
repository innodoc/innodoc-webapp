import type { ReactNode } from 'react'

export const CARD_TYPES = ['example', 'exercise', 'hint', 'info', 'inputHint'] as const

export type CardType = (typeof CARD_TYPES)[number]

export function isCardType(cardType: unknown): cardType is CardType {
  return typeof cardType === 'string' && CARD_TYPES.includes(cardType as CardType)
}

export interface ContentCardProps {
  children: ReactNode
}
