import { Box, Container, styled } from '@mui/material'
import type { ReactNode } from 'react'

import AppBar from './AppBar/AppBar'
import Footer from './Footer'

const Wrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
})

const MainContainer = styled(Container)(({ theme }) => ({
  paddingBottom: theme.spacing(4),
  paddingTop: theme.spacing(4),
  transition: theme.transitions.create('opacity', { duration: 100 }),
})) as typeof Container

function Layout({ children }: LayoutProps) {
  return (
    <Wrapper>
      <AppBar />
      <MainContainer component="main" data-testid="main-container" maxWidth="lg">
        {children}
      </MainContainer>
      <Footer />
    </Wrapper>
  )
}

interface LayoutProps {
  children: ReactNode
}

export default Layout
