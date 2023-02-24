import { configureStore } from '@reduxjs/toolkit'
import type { PreloadedState, StateFromReducersMapObject } from '@reduxjs/toolkit'

import appSlice from './slices/appSlice'
import contentApi from './slices/contentApi'
import staticCache from './slices/staticCache'

const reducer = {
  [contentApi.reducerPath]: contentApi.reducer,
  [staticCache.reducerPath]: staticCache.reducer,
  [appSlice.name]: appSlice.reducer,
}

function makeStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    devTools: import.meta.env.MODE === 'development',
    middleware(getDefaultMiddleware) {
      const middleware = getDefaultMiddleware().concat([
        contentApi.middleware,
        staticCache.middleware,
      ])
      return middleware
    },
    preloadedState,
    reducer,
  })
}

export type Store = ReturnType<typeof makeStore>
export type RootState = StateFromReducersMapObject<typeof reducer>
export type AppDispatch = Store['dispatch']

export default makeStore
