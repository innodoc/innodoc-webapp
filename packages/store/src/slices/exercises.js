import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

const exercisesAdapter = createEntityAdapter()

const exercisesSlice = createSlice({
  name: 'exercises',
  initialState: exercisesAdapter.getInitialState(),
  reducers: {
    exerciseReset: () => {},
  },
})

export const selectors = exercisesAdapter.getSelectors((state) => state.exercises)
export const { actions } = exercisesSlice
export default exercisesSlice.reducer
