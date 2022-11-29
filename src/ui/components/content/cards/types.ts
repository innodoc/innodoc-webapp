import type { Root } from 'mdast'

export const CARD_TYPES = ['example', 'exercise', 'hint', 'info', 'inputHint'] as const

export type CardType = typeof CARD_TYPES[number]

export interface ContentCardProps {
  content: Root
}
