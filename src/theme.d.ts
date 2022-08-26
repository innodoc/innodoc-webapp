import '@mui/material/styles/experimental_extendTheme'

interface PaletteFooter {
  defaultBg: string
}

declare module '@mui/material/styles/experimental_extendTheme' {
  interface CssVarsPalette {
    Footer: PaletteFooter
  }

  interface ThemeVars {
    shadowFooter: string
  }
}
