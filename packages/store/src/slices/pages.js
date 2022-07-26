import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

const pagesAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.title.localeCompare(b.title),
})

const pagesSlice = createSlice({
  name: 'pages',
  initialState: pagesAdapter.getInitialState(),
  reducers: {
    pageAdded: pagesAdapter.addOne,
  },
})

export const selectors = pagesAdapter.getSelectors((state) => state.pages)
export const { actions } = pagesSlice
export default pagesSlice.reducer
