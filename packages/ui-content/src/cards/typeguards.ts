import { CARD_TYPES } from '@innodoc/shared-core/constants'
import type { CardType } from '@innodoc/shared-core/types'

function isCardType(cardType: unknown): cardType is CardType {
  return typeof cardType === 'string' && CARD_TYPES.includes(cardType as CardType)
}

export { isCardType }
