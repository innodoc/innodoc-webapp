/* eslint-disable unicorn/prefer-spread */
import { combineReducers, configureStore } from '@reduxjs/toolkit'

import hastListenerMiddleware from './middlewares/hast-listener-middleware/hast-listener-middleware.js'
import localeListenerMiddleware from './middlewares/locale-listener-middleware.js'
import appSlice from './slices/app/app-slice.js'
import contentApi from './slices/content/content-api.js'
import hastSlice from './slices/hast/hast-slice.js'
import type { RootState } from './types.js'

const rootReducer = combineReducers({
  [contentApi.reducerPath]: contentApi.reducer,
  [appSlice.name]: appSlice.reducer,
  [hastSlice.name]: hastSlice.reducer,
})

/** Store factory */
function makeStore(preloadedState?: RootState) {
  return configureStore({
    devTools: import.meta.env.DEV,
    middleware: (getDefaultMiddleware) => {
      const middlewares = getDefaultMiddleware().concat(contentApi.middleware)

      if (import.meta.env.SSR) {
        return middlewares
      }

      // Add client middlewares
      return middlewares.prepend(localeListenerMiddleware.middleware).concat(hastListenerMiddleware.middleware)
    },
    preloadedState,
    reducer: rootReducer,
  })
}

export { rootReducer }
export default makeStore
