import { AppBar as MuiAppBar, Box, Container, Toolbar } from '@mui/material'

import Logo from './Logo'
import MobileMenu from './MobileMenu'
import NavMenu from './NavMenu'
import UserMenu from './UserMenu/UserMenu'

function AppBar() {
  return (
    <MuiAppBar color="transparent" position="relative" sx={{ boxShadow: 1 }}>
      <Container disableGutters maxWidth="md">
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
