export const CARD_TYPES = ['example', 'exercise', 'info', 'inputHint'] as const

export type CardType = typeof CARD_TYPES[number]
