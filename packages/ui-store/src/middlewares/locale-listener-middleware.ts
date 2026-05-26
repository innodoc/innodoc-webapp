import { createListenerMiddleware } from '@reduxjs/toolkit'
import i18next from 'i18next'
import { changeRouteInfo } from '#slices/app'
import type { AppStartListening } from '#types'

const localeListenerMiddleware = createListenerMiddleware()

// Client-only, on server language doesn't change
if (!import.meta.env.SSR) {
  const startListening = localeListenerMiddleware.startListening as AppStartListening
  startListening({
    actionCreator: changeRouteInfo,
    effect: async (action) => {
      // Notify i18n about language change
      const { locale } = action.payload
      if (i18next.isInitialized) {
        await i18next.changeLanguage(locale)
      }
    },
  })
}

export default localeListenerMiddleware
