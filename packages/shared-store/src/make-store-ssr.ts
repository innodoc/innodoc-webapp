import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducer.js'
import contentApi from './slices/content/content-api.js'

/** SSR store factory. */
function makeStore() {
  return configureStore({
    devTools: false,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(contentApi.middleware),
    reducer: rootReducer,
  })
}

export type { rootReducer }
export default makeStore
