import { grey } from '@mui/material/colors'
import type { DefaultColorScheme } from '@mui/material/styles/experimental_extendTheme'
import {
  type CssVarsThemeOptions,
  experimental_extendTheme as extendTheme,
  responsiveFontSizes,
  type ThemeOptions,
} from '@mui/material/styles/index.js'

// Augment theme type
import type {} from '@mui/material/themeCssVarsAugmentation'
import type {} from '@mui/lab/themeAugmentation'

import type { PaletteCard } from '#theme'
import { CARD_TYPES, type CardType } from '#ui/components/content/cards/types'

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

const cardColors: Record<CardType, CardColors> = {
  example: {
    main: '#ffdb99',
    secondary: '#fff1db',
  },
  exercise: {
    main: '#fff1b8',
    secondary: '#fffbe6',
  },
  info: {
    main: '#bae7ff',
    secondary: '#dbf1ff',
  },
  inputHint: {
    main: '#dff8c9',
    secondary: '#f6ffed',
  },
  hint: {
    main: 'hsla(0, 0%, 100%, 0.85)',
    secondary: 'white',
  },
}

/** Card colors */
interface CardColors {
  /** Main color */
  main: string
  /** Muted color variant */
  secondary: string
}

function getCardColors(palette: DefaultColorScheme, cardType: CardType): PaletteCard {
  return palette === 'light'
    ? {
        bg: cardColors[cardType].secondary,
        color: 'inherit',
        header: cardColors[cardType].main,
      }
    : {
        bg: 'inherit',
        color: cardColors[cardType].main,
        header: 'rgba(255, 255, 255, 0.1)',
      }
}

const cssVarsOpts = {
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: grey[200],
        },
        Card: CARD_TYPES.reduce(
          (acc, cardType) => ({ ...acc, [cardType]: getCardColors('light', cardType) }),
          {}
        ),
        Code: {
          bg: 'rgba(0, 0, 0, 0.05)',
          border: 'rgba(0, 0, 0, 0.1)',
          color: 'rgba(0, 0, 0, 0.85)',
        },
        TransparentPaper: {
          bg: 'rgba(255, 255, 255, 0.4)',
        },
        Footer: {
          bg: 'rgb(28, 28, 28)',
        },
      },
      shadowFooter: 'inset 0 1rem 0.4rem -0.5rem rgba(0 0 0 / 35%)',
    },
    dark: {
      palette: {
        Card: CARD_TYPES.reduce(
          (acc, cardType) => ({ ...acc, [cardType]: getCardColors('dark', cardType) }),
          {}
        ),
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

const baseThemeOpts: ThemeOptions = {
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

function makeTheme(themeOpts: ThemeOptions = baseThemeOpts) {
  return responsiveFontSizes(extendTheme(cssVarsOpts, themeOpts))
}

const theme = makeTheme()

export { baseThemeOpts, makeTheme }
export default theme
