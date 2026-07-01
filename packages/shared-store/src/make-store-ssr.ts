import { configureStore } from '@reduxjs/toolkit'
// oxlint-disable-next-line unicorn/prefer-export-from -- used locally and re-exported
import rootReducer from './reducer.js'
import contentApi from './slices/content/content-api.js'

/** SSR store factory. */
function makeStore() {
  return configureStore({
    devTools: false,
    // oxlint-disable-next-line unicorn/prefer-spread
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(contentApi.middleware),
    reducer: rootReducer,
  })
}

export type { rootReducer }
export default makeStore
