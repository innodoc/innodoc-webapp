import { configureStore, combineReducers } from '@reduxjs/toolkit'

import type { RootState } from './types.js'
import hastListenerMiddleware from './middlewares/hastListenerMiddleware/hastListenerMiddleware.js'
import localeListenerMiddleware from './middlewares/localeListenerMiddleware.js'
import contentApi from './slices/content/contentApi.js'
import appSlice from './slices/app/appSlice.js'
import hastSlice from './slices/hast/hastSlice.js'

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
