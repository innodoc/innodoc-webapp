import '@mui/material/styles/experimental_extendTheme'

interface PaletteFooter {
  bg: string
}

interface PaletteCodeText {
  bg: string
  border: string
  color: string
}

declare module '@mui/material/styles/experimental_extendTheme' {
  interface CssVarsPalette {
    Footer: PaletteFooter
    CodeText: PaletteCodeText
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
