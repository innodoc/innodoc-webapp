import { type PaletteMode, useMediaQuery } from '@mui/material'
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles'
import { useEffect, useMemo, type ReactNode } from 'react'

import { COOKIE_NAME_PALETTE_MODE } from '@/constants'
import { selectPaletteMode } from '@/store/selectors/ui'
import { changeCustomPaletteMode, changeSystemPaletteMode } from '@/store/slices/uiSlice'
import { useDispatch, useSelector } from '@/ui/hooks/store'
import { readCookie } from '@/utils/cookies'

function makeTheme(paletteMode: PaletteMode | null) {
  return responsiveFontSizes(
    createTheme({
      palette: paletteMode === null ? undefined : { mode: paletteMode },

      typography: {
        // Custom font
        fontFamily: 'Lato, Helvetica Neue, Arial, Helvetica, sans-serif',

        // Scale down huge MUI font sizes
        h1: {
          fontSize: '2rem',
          fontWeight: 'bold',
        },
        h2: {
          fontSize: '1.75rem',
          fontWeight: 'bold',
        },
        h3: { fontSize: '1.5rem' },
        h4: { fontSize: '1.3rem' },
        h5: { fontSize: '1.1rem' },
        h6: { fontSize: '1.05rem' },
      },
    })
  )
}

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

  const theme = useMemo(() => makeTheme(paletteMode), [paletteMode])
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}

type ThemeProviderProps = {
  children: ReactNode
}

export default ThemeProvider
