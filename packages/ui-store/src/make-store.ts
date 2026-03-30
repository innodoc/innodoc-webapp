/* eslint-disable unicorn/prefer-spread */
import { combineReducers, configureStore } from '@reduxjs/toolkit'

import appSlice from './slices/app/app-slice.js'
import contentApi from './slices/content/content-api.js'
import hastSlice from './slices/hast/hast-slice.js'
import type { RootState } from './types.js'

interface StoreOptions {
  devTools: boolean
  isSsr: boolean
  preloadedState?: RootState
}

const rootReducer = combineReducers({
  [contentApi.reducerPath]: contentApi.reducer,
  [appSlice.name]: appSlice.reducer,
  [hastSlice.name]: hastSlice.reducer,
})

const defaultOptions = { isSsr: false, devTools: false }

/** Store factory */
async function makeStore(options: Partial<StoreOptions> = {}) {
  const mergedOptions = {
    ...defaultOptions,
    isSsr: options.isSsr,
    devTools: options.devTools,
    preloadedState: options.preloadedState,
  }

  let clientMiddlewares: typeof import('./middlewares/middlewares.js') | null = null

  if (!mergedOptions.isSsr) {
    // Dynamic import ensures Node.js never evaluates client-only modules
    clientMiddlewares = await import('./middlewares/middlewares.js')
  }

  return configureStore({
    devTools: mergedOptions.devTools,
    middleware: (getDefaultMiddleware) => {
      const middlewares = getDefaultMiddleware().concat(contentApi.middleware)

      if (clientMiddlewares) {
        // Add client middlewares
        return middlewares
          .prepend(clientMiddlewares.localeListenerMiddleware.middleware)
          .concat(clientMiddlewares.hastListenerMiddleware.middleware)
      }

      return middlewares
    },
    preloadedState: mergedOptions.preloadedState,
    reducer: rootReducer,
  })
}

export { rootReducer }
export default makeStore
