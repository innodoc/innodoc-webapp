import { Box, Container } from '@mui/material'
import type { ReactNode } from 'react'

import AppBar from './AppBar/AppBar'
import Footer from './Footer/Footer'

function Layout({ children }: LayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <AppBar />
      <Container component="main" sx={{ py: 4 }} maxWidth="lg">
        {children}
      </Container>
      <Box
        component="footer"
        sx={(theme) => ({
          color: 'white',
          py: 5,
          mt: 'auto',
          bgcolor: 'background.footer',
          boxShadow:
            theme.palette.mode === 'light'
              ? 'inset 0 1rem 0.4rem -0.5rem rgba(0 0 0 / 35%)'
              : 'inset 0 1rem 0.4rem -0.5rem rgba(0 0 0 / 5%)',
          '& .MuiLink-root': {
            color: theme.palette.mode === 'light' ? 'primary.light' : 'primary.main',
          },
        })}
      >
        <Container maxWidth="lg">
          <Footer />
        </Container>
      </Box>
    </Box>
  )
}

type LayoutProps = { children: ReactNode }

export default Layout
