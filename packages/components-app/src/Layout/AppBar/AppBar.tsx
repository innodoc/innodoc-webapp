import { AppBar as MuiAppBar, Box, Container, Toolbar } from '@mui/material'

import LanguageMenuButton from './LanguageMenuButton/LanguageMenuButton.js'
import Logo from './Logo.js'
import MobileNavButton from './MobileNavButton.js'
import NavMenu from './NavMenu.js'
import PaletteModeButton from './PaletteModeMenuButton.js'
import TocButton from './TocButton.js'
import UserMenuButton from './UserMenuButton.js'

function AppBar() {
  return (
    <MuiAppBar
      position="relative"
      color="transparent"
      sx={(theme) => ({
        backgroundColor: theme.vars.palette.AppBar.defaultBg,
        boxShadow: 1,
        zIndex: theme.vars.zIndex.appBar,
      })}
    >
      <Container disableGutters maxWidth="lg">
        <Toolbar variant="dense">
          <MobileNavButton />
          <Logo />
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} />
          <NavMenu />
          <TocButton />
          <Box sx={{ display: { xs: 'none', sm: 'inherit' } }}>
            <PaletteModeButton />
            <LanguageMenuButton />
          </Box>
          <UserMenuButton />
        </Toolbar>
      </Container>
    </MuiAppBar>
  )
}

export default AppBar
