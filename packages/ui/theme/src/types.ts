/** Custom theme palette for footer */
interface PaletteFooter {
  bg: string
}

/** Custom theme palette for cards */
interface PaletteCard {
  bg: string
  header: string
  color: string
}

/** Custom theme palette for inline code and code blocks */
interface PaletteCode {
  bg: string
  border: string
  color: string
}

/** Custom theme palette for transparent paper */
interface PaletteTransparentPaper {
  bg: string
}

export type { PaletteCard, PaletteCode, PaletteFooter, PaletteTransparentPaper }
