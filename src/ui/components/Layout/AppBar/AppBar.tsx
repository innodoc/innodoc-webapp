import { AppBar as MuiAppBar, Box, Container, Toolbar } from '@mui/material'

import LanguageMenu from './LanguageMenu'
import Logo from './Logo'
import MobileMenu from './MobileMenu'
import NavMenu from './NavMenu'
import PaletteModeMenu from './PaletteModeMenu'
import UserMenu from './UserMenu'

function AppBar() {
  return (
    <MuiAppBar
      position="relative"
      color="transparent"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(255 255 255 / 15%)' : 'rgba(0 0 0 / 5%)',
        boxShadow: 1,
      }}
    >
      <Container disableGutters maxWidth="lg">
        <Toolbar variant="dense">
          <MobileMenu />
          <Logo />
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} />
          <NavMenu />
          <Box sx={{ display: { xs: 'none', sm: 'inherit' } }}>
            <PaletteModeMenu />
            <LanguageMenu />
          </Box>
          <UserMenu />
        </Toolbar>
      </Container>
    </MuiAppBar>
  )
}

export default AppBar
