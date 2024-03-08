import type { configureStore } from '@reduxjs/toolkit'

import hastListenerMiddleware from './middlewares/hastListenerMiddleware/hastListenerMiddleware'
import localeListenerMiddleware from './middlewares/localeListenerMiddleware'
import contentApi from './slices/content/contentApi'
import type { RootState } from './types'

type RemoveUndefined<T> = T extends undefined ? never : T
type MiddlewareOption = Parameters<typeof configureStore<RootState>>[0]['middleware']
type GetDefaultMiddleware = Parameters<RemoveUndefined<MiddlewareOption>>[0]

function middleware(getDefaultMiddleware: GetDefaultMiddleware) {
  const middlewares = getDefaultMiddleware().concat(contentApi.middleware)

  if (import.meta.env.SSR) {
    return middlewares
  }

  // Add client middlewares
  return middlewares.prepend(localeListenerMiddleware.middleware).concat(hastListenerMiddleware.middleware)
}

export default middleware
