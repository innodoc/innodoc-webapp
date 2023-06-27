import { createListenerMiddleware } from '@reduxjs/toolkit'
import i18next from 'i18next'

import { changeRouteInfo } from '#store/slices/appSlice'

import type { AppStartListening } from './types'

const localeListenerMiddleware = createListenerMiddleware()
const startListening = localeListenerMiddleware.startListening as AppStartListening

if (!import.meta.env.SSR) {
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
