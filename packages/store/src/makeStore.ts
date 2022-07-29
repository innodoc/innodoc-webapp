import { configureStore } from '@reduxjs/toolkit'

import contentApi from './slices/contentApi'
import uiSlice from './slices/uiSlice'

const makeStore = () =>
  configureStore({
    devTools: process.env.NODE_ENV === 'development',

    reducer: {
      [contentApi.reducerPath]: contentApi.reducer,
      [uiSlice.name]: uiSlice.reducer,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(contentApi.middleware),
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export default makeStore
