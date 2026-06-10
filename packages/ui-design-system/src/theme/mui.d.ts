import type { PaletteCard, PaletteCode, PaletteFooter, PaletteTransparentPaper } from './types.js'
import type { CSSProperties } from 'react'
import type { CardType } from '@innodoc/shared-core/types'

export {}

declare module '@mui/material/styles' {
  interface CssVarsPalette {
    Footer: PaletteFooter
    Card: Record<CardType, PaletteCard>
    Code: PaletteCode
    TransparentPaper: PaletteTransparentPaper
  }

  interface ThemeVars {
    shadowFooter: string
  }

  // Enable CSS theme variables
  interface CssThemeVariables {
    enabled: true
  }

  interface TypographyVariants {
    code: CSSProperties
  }

  // allow configuration using `extendTheme`
  interface TypographyVariantsOptions {
    code?: CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    code: true
  }
}
