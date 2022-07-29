import { AppBar as MuiAppBar, Box, Container, Toolbar } from '@mui/material'

import Logo from './Logo'
import MobileMenu from './MobileMenu'
import NavMenu from './NavMenu'
import UserMenu from './UserMenu/UserMenu'

function AppBar() {
  return (
    <MuiAppBar position="relative">
      <Container maxWidth="xl">
        <Toolbar variant="dense">
          <MobileMenu />
          <Logo />
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} />
          <NavMenu />
          <UserMenu />
        </Toolbar>
      </Container>
    </MuiAppBar>
  )
}

export default AppBar
