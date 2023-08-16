import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { HastResult, HastResultWithHash } from '@innodoc/types/common'

import { selectHast, selectHastResultByHash, selectIsProcessing } from './selectors'

interface hastSliceState {
  /** Current content hast */
  content: Record<string, HastResult>

  /** Processing Markdown */
  isProcessing: boolean
}

const initialState: hastSliceState = {
  content: {},
  isProcessing: false,
}

const hastSlice = createSlice({
  name: 'hast',
  initialState,

  reducers: {
    /** Add hast result */
    addHastResult(state, { payload: { hash, ...result } }: PayloadAction<HastResultWithHash>) {
      state.content[hash] = result
    },

    /** Change processing state */
    changeIsProcessing(state, action: PayloadAction<boolean>) {
      state.isProcessing = action.payload
    },
  },
})

export { selectHast, selectHastResultByHash, selectIsProcessing }
export const { addHastResult, changeIsProcessing } = hastSlice.actions
export default hastSlice
