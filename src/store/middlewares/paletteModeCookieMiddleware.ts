import { createListenerMiddleware } from '@reduxjs/toolkit'

import { COOKIE_NAME_PALETTE_MODE } from '@/constants'
import { changeCustomPaletteMode } from '@/store/slices/uiSlice'
import { setCookie } from '@/utils/cookies'

import { AppStartListening } from './types'

const paletteModeCookieMiddleware = createListenerMiddleware()
const startAppListening = paletteModeCookieMiddleware.startListening as AppStartListening

// Save cookie on user palette mode change
startAppListening({
  actionCreator: changeCustomPaletteMode,
  effect: ({ payload: paletteMode }) => {
    setCookie(COOKIE_NAME_PALETTE_MODE, paletteMode)
  },
})

export default paletteModeCookieMiddleware
