import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

const questionsAdapter = createEntityAdapter()

const questionsSlice = createSlice({
  name: 'questions',
  initialState: questionsAdapter.getInitialState(),
  reducers: {
    questionAdded: questionsAdapter.addOne,
    questionAnswered: () => {},
  },
})

export const selectors = questionsAdapter.getSelectors((state) => state.questions)
export const { actions } = questionsSlice
export default questionsSlice.reducer
