import '@mui/material/styles/experimental_extendTheme'
import type { CSSProperties } from 'react'

import type { PaletteCard, PaletteCode, PaletteFooter, PaletteTransparentPaper } from '#types/theme'
import type { CardType } from '#ui/components/content/cards/types'

declare module '@mui/material/styles/experimental_extendTheme' {
  interface CssVarsPalette {
    Footer: PaletteFooter
    Card: Record<CardType, PaletteCard>
    Code: PaletteCode
    TransparentPaper: PaletteTransparentPaper
  }

  interface ThemeVars {
    shadowFooter: string
  }
}

// Add custom code font variant
declare module '@mui/material/styles' {
  interface TypographyVariants {
    code: CSSProperties
  }

  // allow configuration using `createTheme`
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
