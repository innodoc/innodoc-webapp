import { CARD_TYPES } from './Card.js'
import type { CardType } from './types.js'

function isCardType(cardType: unknown): cardType is CardType {
  return typeof cardType === 'string' && CARD_TYPES.includes(cardType as CardType)
}

export { isCardType }
