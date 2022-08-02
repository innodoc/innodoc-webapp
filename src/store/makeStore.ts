import { configureStore } from '@reduxjs/toolkit'
import type { PreloadedState, StateFromReducersMapObject } from '@reduxjs/toolkit'

import contentApi from './slices/contentApi'
import uiSlice from './slices/uiSlice'

const reducer = {
  [contentApi.reducerPath]: contentApi.reducer,
  [uiSlice.name]: uiSlice.reducer,
}

function makeStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    devTools: import.meta.env.MODE === 'development',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(contentApi.middleware),
    preloadedState,
    reducer,
  })
}

export type Store = ReturnType<typeof makeStore>
export type RootState = StateFromReducersMapObject<typeof reducer>
export type AppDispatch = Store['dispatch']

export default makeStore
