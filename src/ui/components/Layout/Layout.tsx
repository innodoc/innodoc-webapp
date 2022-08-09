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
        sx={{
          color: 'white',
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[900] : theme.palette.grey[800],
        }}
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
