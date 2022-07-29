import { Container } from '@mui/material'
import type { ReactNode } from 'react'

import type { Page } from '@innodoc/types'

import AppBar from './AppBar/AppBar'
import Footer from './Footer/Footer'

function Layout({ children }: LayoutProps) {
  const pages: Page[] = [
    {
      icon: 'home',
      id: 'home',
      title: 'Home',
    },
    {
      icon: 'speed',
      id: 'progress',
      title: 'Progress',
    },
  ]

  return (
    <>
      <AppBar pages={pages} />
      <main>
        <Container sx={{ py: 4 }} maxWidth="md">
          {children}
        </Container>
      </main>
      <Footer />
    </>
  )
}

type LayoutProps = { children: ReactNode }

export default Layout
