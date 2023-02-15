import type { ContainerDirective } from 'mdast-util-directive'

export const CARD_TYPES = ['example', 'exercise', 'hint', 'info', 'inputHint'] as const

export type CardType = typeof CARD_TYPES[number]

export interface ContentCardProps {
  node: ContainerDirective
}
