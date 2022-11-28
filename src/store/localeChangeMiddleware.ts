import { createListenerMiddleware, type TypedStartListening } from '@reduxjs/toolkit'
import { getI18n } from 'react-i18next'
import { navigate } from 'vite-plugin-ssr/client/router'

import type { AppDispatch, RootState } from '#store/makeStore'
import { changeLocale, selectUrlWithoutLocale } from '#store/slices/uiSlice'

const localeChangeMiddleware = createListenerMiddleware()
const startAppListening = localeChangeMiddleware.startListening as AppStartListening

// Relay locale change from store to i18next
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

type AppStartListening = TypedStartListening<RootState, AppDispatch>

export default localeChangeMiddleware
