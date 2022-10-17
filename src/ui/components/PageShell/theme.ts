import {
  type CssVarsThemeOptions,
  experimental_extendTheme as extendTheme,
  responsiveFontSizes,
  type ThemeOptions,
} from '@mui/material/styles/index.js'

// Augment theme type
import type {} from '@mui/material/themeCssVarsAugmentation'
import type {} from '@mui/lab/themeAugmentation'

// Use custom Lato font instead of MUI default font
const fontFamily = ['Lato', 'Helvetica Neue', 'Arial', 'Helvetica', 'sans-serif'].join(',')

// Monospace font family
const fontFamilyMonospace = [
  'Consolas',
  'Menlo',
  'Monaco',
  'Andale Mono',
  'Ubuntu Mono',
  'monospace',
].join(',')

const cssVarsThemeOptions = {
  colorSchemes: {
    light: {
      palette: {
        Card: {
          example: {
            bg: '#fff1db',
            color: 'inherit',
            header: '#ffe7ba',
          },
          exercise: {
            bg: 'TODO',
            color: 'inherit',
            header: 'TODO',
          },
          info: {
            bg: '#dbf1ff',
            color: 'inherit',
            header: '#bae7ff',
          },
          inputHint: {
            bg: 'TODO',
            color: 'inherit',
            header: 'TODO',
          },
        },
        Code: {
          bg: 'rgba(0, 0, 0, 0.05)',
          border: 'rgba(0, 0, 0, 0.1)',
          color: 'rgba(0, 0, 0, 0.85)',
        },
        TransparentPaper: {
          bg: 'rgba(255, 255, 255, 0.2)',
        },
        Footer: {
          bg: 'rgb(28, 28, 28)',
        },
      },
      shadowFooter: 'inset 0 1rem 0.4rem -0.5rem rgba(0 0 0 / 35%)',
    },
    dark: {
      palette: {
        Card: {
          example: {
            bg: 'inherit',
            color: '#ffe7ba',
            header: 'inherit',
          },
          exercise: {
            bg: 'inherit',
            color: 'TODO',
            header: 'inherit',
          },
          info: {
            bg: 'inherit',
            color: '#bae7ff',
            header: 'inherit',
          },
          inputHint: {
            bg: 'inherit',
            color: 'TODO',
            header: 'inherit',
          },
        },
        Code: {
          bg: 'rgba(255, 255, 255, 0.2)',
          border: 'rgba(255, 255, 255, 0.1)',
          color: 'rgba(255, 255, 255, 0.9)',
        },
        TransparentPaper: {
          bg: 'rgba(255, 255, 255, 0.03)',
        },
        Footer: {
          bg: 'rgb(13, 13, 13)',
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
    fontFamily,

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

    // Custom code variant
    code: {
      fontFamily: fontFamilyMonospace,
      margin: '0 0.1rem',
      padding: '0.2rem',
    },
  },
}

export default responsiveFontSizes(extendTheme(cssVarsThemeOptions, theme))
