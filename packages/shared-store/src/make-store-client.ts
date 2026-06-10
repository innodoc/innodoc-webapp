import type { RootState } from './types.js'
import { configureStore } from '@reduxjs/toolkit'
import type { RouteManager } from '@innodoc/shared-core/routes'
import { hastListenerMiddleware, localeListenerMiddleware, setupHastListeners } from './middlewares/middlewares.js'
import rootReducer from './reducer.js'
import contentApi from './slices/content/content-api.js'

interface StoreOptions {
  devTools?: boolean
  preloadedState?: RootState
  routeManager: RouteManager
}

/** Client store factory. */
function makeStore(options: StoreOptions) {
  const store = configureStore({
    devTools: options.devTools ?? false,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(contentApi.middleware)
        .prepend(localeListenerMiddleware.middleware)
        .concat(hastListenerMiddleware.middleware),
    preloadedState: options.preloadedState,
    reducer: rootReducer,
  })

  setupHastListeners(options.routeManager)

  return store
}

export default makeStore
