import { Box, Container, styled } from '@mui/material'
import type { ReactNode } from 'react'

import AppBar from './AppBar/AppBar'
import Footer from './Footer'

const MainContainer = styled(Container)(({ theme }) => ({
  paddingBottom: theme.spacing(4),
  paddingTop: theme.spacing(4),
})) as typeof Container

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
      <MainContainer component="main" data-testid="main-container" maxWidth="lg">
        {children}
      </MainContainer>
      <Footer />
    </Box>
  )
}

interface LayoutProps {
  children: ReactNode
}

export default Layout
