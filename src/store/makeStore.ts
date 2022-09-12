import { configureStore } from '@reduxjs/toolkit'
import type { PreloadedState, StateFromReducersMapObject } from '@reduxjs/toolkit'

import localeChangeMiddleware from './middlewares/localeChangeMiddleware'
import contentApi from './slices/contentApi'
import uiSlice from './slices/uiSlice'

const reducer = {
  [contentApi.reducerPath]: contentApi.reducer,
  [uiSlice.name]: uiSlice.reducer,
}

function makeStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    devTools: import.meta.env.MODE === 'development',
    middleware(getDefaultMiddleware) {
      const middleware = getDefaultMiddleware().concat(contentApi.middleware)
      if (!import.meta.env.SSR) {
        // Only on client
        return middleware.prepend(localeChangeMiddleware.middleware)
      }
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
