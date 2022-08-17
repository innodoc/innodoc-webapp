import type { PaletteMode } from '@mui/material'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'

function makeTheme(mode: PaletteMode) {
  return responsiveFontSizes(
    createTheme({
      palette: {
        mode,
        primary: { main: 'rgb(15, 112, 172)' },
        secondary: { main: 'rgb(197, 14, 31)' },
        error: { main: 'rgb(238, 88, 47)' },
        warning: { main: 'rgb(253, 176, 43)' },
        info: { main: 'rgb(22, 165, 196)' },
        success: { main: 'rgb(14, 196, 180)' },
        background: {
          footer: mode === 'light' ? 'rgb(28, 28, 28)' : 'rgb(13, 13, 13)',
        },
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
    })
  )
}

export default makeTheme
