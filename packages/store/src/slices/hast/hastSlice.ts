import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction, Slice } from '@reduxjs/toolkit'

import type { HastResult, HastResultWithHash } from '@innodoc/types/common'

import { selectHast, selectHastResultByHash, selectIsProcessing } from './selectors.js'

interface HastSliceState {
  /** Current content hast */
  content: Record<string, HastResult>

  /** Processing Markdown */
  isProcessing: boolean
}

// Explicit type (otherwise TS gives 'exceeds the maximum length')
type HastSlice = Slice<
  HastSliceState,
  {
    addHastResult: (state: HastSliceState, action: PayloadAction<HastResultWithHash>) => void
    changeIsProcessing: (state: HastSliceState, action: PayloadAction<boolean>) => void
  },
  'hast'
>

const initialState: HastSliceState = {
  content: {},
  isProcessing: false,
}

const hastSlice = createSlice({
  name: 'hast',
  initialState,

  reducers: {
    /** Add hast result */
    addHastResult(state, { payload: { hash, ...result } }) {
      state.content[hash] = result
    },

    /** Change processing state */
    changeIsProcessing(state, action) {
      state.isProcessing = action.payload
    },
  },
}) as HastSlice

export type { HastSliceState }
export { selectHast, selectHastResultByHash, selectIsProcessing }
export const { addHastResult, changeIsProcessing } = hastSlice.actions
export default hastSlice
