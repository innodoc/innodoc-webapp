import type { HastResult } from '@innodoc/types/common'

import type { RootState } from '#types'

/** Select hast slice */
const selectHast = (state: RootState) => state.hast

/** Select hast result */
const selectHastResultByHash = (state: RootState, hash: string): HastResult | undefined =>
  selectHast(state).content[hash]

/** Select processing state */
const selectIsProcessing = (state: RootState) => selectHast(state).isProcessing

export { selectHast, selectHastResultByHash, selectIsProcessing }
