import { configureStore } from '@reduxjs/toolkit'

import middleware from './middleware.js'
import reducer from './reducer.js'
import type { RootState } from './types.js'

/** Store factory */
const makeStore = (preloadedState?: RootState) => {
  return configureStore({
    devTools: import.meta.env.DEV,
    middleware,
    preloadedState,
    reducer,
  })
}

export default makeStore
