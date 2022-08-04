import { useMediaQuery } from '@mui/material'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { useEffect, type ReactNode } from 'react'

import { selectTheme } from '@/store/selectors/ui'
import { changeTheme } from '@/store/slices/uiSlice'
import { useDispatch, useSelector } from '@/ui/hooks/store'

const darkTheme = createTheme({ palette: { mode: 'dark' } })
const lightTheme = createTheme({ palette: { mode: 'light' } })

// Use system theme unless overridden by user
function ThemeProvider({ children }: ThemeProviderProps) {
  const dispatch = useDispatch()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const selectedTheme = useSelector(selectTheme)

  useEffect(() => {
    if (selectedTheme === null) {
      dispatch(changeTheme(prefersDarkMode ? 'dark' : 'light'))
    }
  }, [dispatch, selectedTheme, prefersDarkMode])

  const theme = selectedTheme === 'dark' ? darkTheme : lightTheme
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}

type ThemeProviderProps = {
  children: ReactNode
}

export default ThemeProvider
