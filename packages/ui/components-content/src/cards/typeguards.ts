import { CARD_TYPES } from '@innodoc/constants'
import type { CardType } from '@innodoc/types/common'

function isCardType(cardType: unknown): cardType is CardType {
  return typeof cardType === 'string' && CARD_TYPES.includes(cardType as CardType)
}

export { isCardType }
