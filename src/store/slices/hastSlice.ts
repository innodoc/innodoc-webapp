import { type PayloadAction, createSlice, createSelector } from '@reduxjs/toolkit'

import type { HastRoot } from '#markdown/markdownToHast/markdownToHast'
import type { RootState } from '#store/makeStore'
import type { HastRootWithHash } from '#types/common'

type ContentCache = Record<string, HastRoot>

interface hastSliceState {
  /** Current content hast */
  content: ContentCache

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
    /** Add hast root */
    addHastRoot(state, action: PayloadAction<HastRootWithHash>) {
      const { hash, root } = action.payload
      state.content[hash] = root
    },

    /** Change processing state */
    changeIsProcessing(state, action: PayloadAction<boolean>) {
      state.isProcessing = action.payload
    },
  },
})

/** Select hast slice */
export const selectHast = (state: RootState) => state[hastSlice.name]

/** Select hast root */
export const makeSelectHastRootByHash = () =>
  createSelector([selectHast, (state, hash?: string) => hash], (hastSlice, hash) =>
    hash !== undefined ? hastSlice.content[hash] : undefined
  )

/** Select processing state */
export const selectIsProcessing = (state: RootState) => selectHast(state).isProcessing

export const { addHastRoot, changeIsProcessing } = hastSlice.actions
export default hastSlice
