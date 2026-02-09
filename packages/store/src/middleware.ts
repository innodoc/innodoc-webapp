/* eslint-disable unicorn/prefer-spread */
import type { configureStore } from '@reduxjs/toolkit'

import hastListenerMiddleware from './middlewares/hastListenerMiddleware/hastListenerMiddleware.js'
import localeListenerMiddleware from './middlewares/localeListenerMiddleware.js'
import contentApi from './slices/content/contentApi.js'
import type { RootState } from './types.js'

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
