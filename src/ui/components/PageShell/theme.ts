import {
  type CssVarsThemeOptions,
  experimental_extendTheme as extendTheme,
  responsiveFontSizes,
  type ThemeOptions,
} from '@mui/material/styles'

// Augment theme type
import type {} from '@mui/material/themeCssVarsAugmentation'
import type {} from '@mui/lab/themeAugmentation'

const cssVarsThemeOptions = {
  colorSchemes: {
    light: {
      palette: {
        Footer: {
          defaultBg: 'rgb(28, 28, 28)',
        },
      },
      shadowFooter: 'inset 0 1rem 0.4rem -0.5rem rgba(0 0 0 / 35%)',
    },
    dark: {
      palette: {
        Footer: {
          defaultBg: 'rgb(13, 13, 13)',
        },
      },
      shadowFooter: 'inset 0 1rem 0.4rem -0.5rem rgba(0 0 0 / 5%)',
    },
  },
} as CssVarsThemeOptions // Can't augment `ColorSystemOptions['palette']`...

const theme: ThemeOptions = {
  palette: {
    primary: { main: 'rgb(15, 112, 172)' },
    secondary: { main: 'rgb(197, 14, 31)' },
    error: { main: 'rgb(238, 88, 47)' },
    warning: { main: 'rgb(253, 176, 43)' },
    info: { main: 'rgb(22, 165, 196)' },
    success: { main: 'rgb(14, 196, 180)' },
  },
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
}

export default responsiveFontSizes(extendTheme(cssVarsThemeOptions, theme))
