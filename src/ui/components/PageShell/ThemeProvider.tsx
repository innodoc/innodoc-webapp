import { type PaletteMode, useMediaQuery } from '@mui/material'
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles'
import { useEffect, useMemo, type ReactNode } from 'react'

import { selectTheme } from '@/store/selectors/ui'
import { changeTheme } from '@/store/slices/uiSlice'
import { useDispatch, useSelector } from '@/ui/hooks/store'

function makeTheme(paletteMode: PaletteMode) {
  return responsiveFontSizes(
    createTheme({
      palette: { mode: paletteMode },
      typography: {
        // Scale down huge MUI font sizes using new=(orig-1)*0.4+1
        h1: { fontSize: '3rem' },
        h2: { fontSize: '2.1rem' },
        h3: { fontSize: '1.8rem' },
        h4: { fontSize: '1.45rem' },
        h5: { fontSize: '1.2rem' },
        h6: { fontSize: '1.1rem' },
      },
    })
  )
}

// Use system theme unless overridden by user
function ThemeProvider({ children }: ThemeProviderProps) {
  const dispatch = useDispatch()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const prefersPaletteMode: PaletteMode = prefersDarkMode ? 'dark' : 'light'
  const selectedTheme = useSelector(selectTheme)

  useEffect(() => {
    if (selectedTheme === null) {
      dispatch(changeTheme(prefersPaletteMode))
    }
  }, [dispatch, selectedTheme, prefersPaletteMode])

  const theme = useMemo(
    () => makeTheme(selectedTheme || prefersPaletteMode),
    [prefersPaletteMode, selectedTheme]
  )
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}

type ThemeProviderProps = {
  children: ReactNode
}

export default ThemeProvider
