import { configureStore } from '@reduxjs/toolkit'
import type { PreloadedState, StateFromReducersMapObject } from '@reduxjs/toolkit'
import type { CurriedGetDefaultMiddleware } from '@reduxjs/toolkit/dist/getDefaultMiddleware'

import hastListenerMiddleware from './middlewares/hastListenerMiddleware/hastListenerMiddleware'
import localeListenerMiddleware from './middlewares/localeListenerMiddleware'
import appSlice from './slices/appSlice'
import contentApi from './slices/contentApi'
import hastSlice from './slices/hastSlice'
import staticCache from './slices/staticCache'

const reducer = {
  [contentApi.reducerPath]: contentApi.reducer,
  [staticCache.reducerPath]: staticCache.reducer,
  [appSlice.name]: appSlice.reducer,
  [hastSlice.name]: hastSlice.reducer,
}

function middleware(getDefaultMiddleware: CurriedGetDefaultMiddleware<RootState>) {
  return getDefaultMiddleware()
    .concat([contentApi.middleware, staticCache.middleware, hastListenerMiddleware.middleware])
    .prepend(localeListenerMiddleware.middleware)
}

/** Store factory */
function makeStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    devTools: import.meta.env.MODE === 'development',
    middleware,
    preloadedState,
    reducer,
  })
}

/** Store type */
export type Store = ReturnType<typeof makeStore>

/** Root state */
export type RootState = StateFromReducersMapObject<typeof reducer>

/** Dispatch type */
export type AppDispatch = Store['dispatch']

export default makeStore
