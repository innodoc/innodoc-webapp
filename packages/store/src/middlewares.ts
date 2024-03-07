import hastListenerMiddleware from './middlewares/hastListenerMiddleware/hastListenerMiddleware'
import localeListenerMiddleware from './middlewares/localeListenerMiddleware'
import contentApi from './slices/content/contentApi'
import type { GetDefaultMiddleware } from './types'

function middlewares(getDefaultMiddleware: GetDefaultMiddleware) {
  return getDefaultMiddleware()
    .prepend(localeListenerMiddleware.middleware)
    .concat(contentApi.middleware, hastListenerMiddleware.middleware)
}

export default middlewares
