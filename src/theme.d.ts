import '@mui/material/styles/experimental_extendTheme'
import type { CardType } from './ui/components/content/cards/types'

interface PaletteFooter {
  bg: string
}

interface PaletteCard {
  bg: string
  header: string
  color: string
}

interface PaletteCode {
  bg: string
  border: string
  color: string
}

interface PaletteTransparentPaper {
  bg: string
}

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
    code: React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    code?: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    code: true
  }
}
