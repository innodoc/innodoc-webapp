import { AppBar as MuiAppBar, Box, Container, Toolbar } from '@mui/material'

import { Page } from '@innodoc/types'

import Logo from './Logo'
import MobileMenu from './MobileMenu'
import NavMenu from './NavMenu'
import UserMenu from './UserMenu/UserMenu'

function AppBar({ pages }: AppBarProps) {
  return (
    <MuiAppBar position="relative">
      <Container maxWidth="xl">
        <Toolbar variant="dense">
          <MobileMenu pages={pages} />
          <Logo />
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} />
          <NavMenu pages={pages} />
          <UserMenu />
        </Toolbar>
      </Container>
    </MuiAppBar>
  )
}

type AppBarProps = { pages: Page[] }

export default AppBar
