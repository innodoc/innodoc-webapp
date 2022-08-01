import { PaletteMode } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react'

const SwitchableThemeContext = createContext<SwitchableThemeContextValue>({
  paletteMode: 'light',
  setPaletteMode: () => undefined,
})

export function SwitchableThemeProvider({ children }: SwitchableThemeProviderProps) {
  const systemDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [paletteMode, setPaletteMode] = useState<PaletteMode>(systemDarkMode ? 'dark' : 'light')

  // TODO: add current locale
  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: paletteMode },
      }),
    [paletteMode]
  )

  return (
    <SwitchableThemeContext.Provider value={{ paletteMode, setPaletteMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </SwitchableThemeContext.Provider>
  )
}

type SwitchableThemeProviderProps = { children: ReactNode }

type SwitchableThemeContextValue = {
  paletteMode: PaletteMode
  setPaletteMode: Dispatch<SetStateAction<PaletteMode>>
}

export default SwitchableThemeContext
