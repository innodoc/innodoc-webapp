import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

import type { RootState } from '#store/makeStore'
import type { HastResult, HastResultWithHash } from '#types/common'

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

/** Select hast slice */
export const selectHast = (state: RootState) => state[hastSlice.name]

/** Select hast result */
export const selectHastResultByHash = (state: RootState, hash: string) =>
  selectHast(state).content[hash]

/** Select processing state */
export const selectIsProcessing = (state: RootState) => selectHast(state).isProcessing

export const { addHastResult, changeIsProcessing } = hastSlice.actions
export default hastSlice
