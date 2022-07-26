import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

const sectionsAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.title.localeCompare(b.title),
})

const sectionsSlice = createSlice({
  name: 'sections',
  initialState: sectionsAdapter.getInitialState(),
  reducers: {
    sectionAdded: sectionsAdapter.addOne,
  },
})

export const selectors = sectionsAdapter.getSelectors((state) => state.sections)
export const { actions } = sectionsSlice
export default sectionsSlice.reducer
