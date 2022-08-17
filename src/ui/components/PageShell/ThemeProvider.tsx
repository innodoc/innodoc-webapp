import { type PaletteMode, useMediaQuery } from '@mui/material'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { useEffect, useMemo, type ReactNode } from 'react'

import { COOKIE_NAME_PALETTE_MODE } from '@/constants'
import { selectPaletteMode } from '@/store/selectors/ui'
import { changeCustomPaletteMode, changeSystemPaletteMode } from '@/store/slices/uiSlice'
import { useDispatch, useSelector } from '@/ui/hooks/store'
import { readCookie } from '@/utils/cookies'
import makeTheme from '@/utils/makeTheme'

function ThemeProvider({ children }: ThemeProviderProps) {
  const dispatch = useDispatch()

  // Mode from store
  const paletteMode = useSelector(selectPaletteMode)

  // System preference
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  // Sync system preference to store
  useEffect(() => {
    dispatch(changeSystemPaletteMode(prefersDarkMode ? 'dark' : 'light'))
  }, [dispatch, prefersDarkMode])

  // Restore cookie
  useEffect(() => {
    const value = readCookie(COOKIE_NAME_PALETTE_MODE)
    if (value !== undefined && ['dark', 'light'].includes(value)) {
      dispatch(changeCustomPaletteMode(value as PaletteMode))
    }
  }, [dispatch])

  const theme = useMemo(() => makeTheme(paletteMode || 'light'), [paletteMode])
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}

type ThemeProviderProps = {
  children: ReactNode
}

export default ThemeProvider
