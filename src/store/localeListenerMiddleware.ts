import { createListenerMiddleware } from '@reduxjs/toolkit'
import i18next from 'i18next'

import { changeRouteInfo } from './slices/appSlice'

const localeListenerMiddleware = createListenerMiddleware()

// Notify i18n about language change
localeListenerMiddleware.startListening({
  actionCreator: changeRouteInfo,
  effect: async (action) => {
    const { locale } = action.payload
    if (!import.meta.env.SSR && i18next.isInitialized) {
      await i18next.changeLanguage(locale)
    }
  },
})

export default localeListenerMiddleware
