import { combineReducers } from '@reduxjs/toolkit'
import appSlice from './slices/app/app-slice.js'
import contentApi from './slices/content/content-api.js'
import hastSlice from './slices/hast/hast-slice.js'

const rootReducer = combineReducers({
  [contentApi.reducerPath]: contentApi.reducer,
  [appSlice.name]: appSlice.reducer,
  [hastSlice.name]: hastSlice.reducer,
})

export default rootReducer
