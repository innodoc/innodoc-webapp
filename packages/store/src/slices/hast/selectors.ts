import type { RootState } from '#types'

/** Select hast slice */
export const selectHast = (state: RootState) => state.hast

/** Select hast result */
export const selectHastResultByHash = (state: RootState, hash: string) =>
  selectHast(state).content[hash]

/** Select processing state */
export const selectIsProcessing = (state: RootState) => selectHast(state).isProcessing
