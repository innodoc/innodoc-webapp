import type { RootState } from './types.js'
import type { Middleware } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { localeListenerMiddleware } from './middlewares/middlewares.js'
import rootReducer from './reducer.js'
import contentApi from './slices/content/content-api.js'

interface StoreOptions {
  devTools?: boolean
  extraMiddlewares?: Middleware[]
  preloadedState?: RootState
}

/** Client store factory. */
function makeStore(options: StoreOptions = {}) {
  const store = configureStore({
    devTools: options.devTools ?? false,
    middleware: (getDefaultMiddleware) =>
      // oxlint-disable-next-line unicorn/prefer-spread
      getDefaultMiddleware()
        .concat(contentApi.middleware)
        .concat(options.extraMiddlewares ?? [])
        .prepend(localeListenerMiddleware.middleware),
    preloadedState: options.preloadedState,
    reducer: rootReducer,
  })

  return store
}

export default makeStore
