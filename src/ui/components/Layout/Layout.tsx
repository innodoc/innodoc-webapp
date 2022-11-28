import { Box, Container } from '@mui/material'
import type { ReactNode } from 'react'

import AppBar from './AppBar/AppBar'
import Footer from './Footer'
import MetaTags from './MetaTags'

function Layout({ children }: LayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <MetaTags />
      <AppBar />
      <Container component="main" sx={{ py: 4 }} maxWidth="lg">
        {children}
      </Container>
      <Footer />
    </Box>
  )
}

interface LayoutProps {
  children: ReactNode
}

export default Layout
