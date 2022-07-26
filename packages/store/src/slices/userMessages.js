import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

const userMessagesAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.title.localeCompare(b.title),
})

const userMessagesSlice = createSlice({
  name: 'userMessages',
  initialState: userMessagesAdapter.getInitialState(),
  reducers: {
    popUserMessage: () => {},
    userMessageAdded: userMessagesAdapter.addOne,
  },
})

export const selectors = userMessagesAdapter.getSelectors((state) => state.userMessages)
export const { actions } = userMessagesSlice
export default userMessagesSlice.reducer
