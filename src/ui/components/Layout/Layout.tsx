import { Container } from '@mui/material'
import type { ReactNode } from 'react'

import AppBar from './AppBar/AppBar'
import Footer from './Footer/Footer'

function Layout({ children }: LayoutProps) {
  return (
    <>
      <AppBar />
      <main>
        <Container sx={{ py: 4 }} maxWidth="lg">
          {children}
        </Container>
      </main>
      <Footer />
    </>
  )
}

type LayoutProps = { children: ReactNode }

export default Layout
