import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { HastResult, HastResultWithHash } from '@innodoc/shared-core/types'

interface HastSliceState {
  /** Current content hast */
  content: Record<string, HastResult>

  /** Processing Markdown */
  isProcessing: boolean
}

const initialState: HastSliceState = {
  content: {},
  isProcessing: false,
}

const hastSlice = createSlice({
  name: 'hast',
  initialState,

  reducers: {
    /** Add hast result */
    addHastResult(state: HastSliceState, { payload: { hash, ...result } }: PayloadAction<HastResultWithHash>) {
      state.content[hash] = result
    },

    /** Change processing state */
    changeIsProcessing(state: HastSliceState, action: PayloadAction<boolean>) {
      state.isProcessing = action.payload
    },
  },
})

export type { HastSliceState }
export { selectHast, selectHastResultByHash, selectIsProcessing } from './selectors.js'
export const { addHastResult, changeIsProcessing } = hastSlice.actions
export default hastSlice
