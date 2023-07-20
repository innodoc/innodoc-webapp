import type { CurriedGetDefaultMiddleware } from '@reduxjs/toolkit/dist/getDefaultMiddleware'

import hastListenerMiddleware from './middlewares/hastListenerMiddleware/hastListenerMiddleware'
import localeListenerMiddleware from './middlewares/localeListenerMiddleware'
import contentApi from './slices/content/contentApi'
import type { RootState } from './types'

function middleware(getDefaultMiddleware: CurriedGetDefaultMiddleware<RootState>) {
  return getDefaultMiddleware()
    .concat([contentApi.middleware, hastListenerMiddleware.middleware])
    .prepend(localeListenerMiddleware.middleware)
}

export default middleware
