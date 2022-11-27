import { createListenerMiddleware } from '@reduxjs/toolkit'
import { getI18n } from 'react-i18next'
import { navigate } from 'vite-plugin-ssr/client/router'

import { changeLocale, selectUrlWithoutLocale } from '#store/slices/uiSlice'

import type { AppStartListening } from './types'

const localeChangeMiddleware = createListenerMiddleware()
const startAppListening = localeChangeMiddleware.startListening as AppStartListening

// Relay locale changes
startAppListening({
  actionCreator: changeLocale,
  effect: async (action, listenerApi) => {
    const newLocale = action.payload

    // i18next locale change
    await getI18n().changeLanguage(newLocale)

    // vite-plugin-ssr navigation
    const urlWithoutLocale = selectUrlWithoutLocale(listenerApi.getState())
    if (urlWithoutLocale !== null) {
      await navigate(`/${newLocale}${urlWithoutLocale}`, {
        keepScrollPosition: true,
        overwriteLastHistoryEntry: true,
      })
    }
  },
})

export default localeChangeMiddleware
