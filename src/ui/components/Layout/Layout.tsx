import { Box, Container, styled } from '@mui/material'
import type { ReactNode } from 'react'

import AppBar from './AppBar/AppBar'
import Footer from './Footer'
import MetaTags from './MetaTags'

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
      <MetaTags />
      <AppBar />
      <MainContainer component="main" maxWidth="lg">
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
