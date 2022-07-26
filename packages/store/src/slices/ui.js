import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarVisible: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarVisible = !state.sidebarVisible
    },
  },
})

export const { actions } = uiSlice
export default uiSlice.reducer
