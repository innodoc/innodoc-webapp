import { configureStore } from '@reduxjs/toolkit'

import middleware from './middleware'
import reducer from './reducer'
import type { RootState } from './types'

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
