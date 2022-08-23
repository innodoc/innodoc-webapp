import { AppBar as MuiAppBar, Box, Container, Toolbar } from '@mui/material'
import { grey } from '@mui/material/colors'
import { memo } from 'react'

import LanguageMenuButton from './LanguageMenuButton'
import Logo from './Logo'
import MobileNavButton from './MobileNavButton'
import NavMenu from './NavMenu'
import PaletteModeButton from './PaletteModeMenuButton'
import TocButton from './TocButton'
import UserMenuButton from './UserMenuButton'

function AppBar() {
  return (
    <MuiAppBar
      position="relative"
      color="transparent"
      sx={(theme) => ({
        backgroundColor: grey[theme.palette.mode === 'dark' ? 800 : 50],
        boxShadow: 1,
        zIndex: theme.zIndex.appBar,
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

export default memo(AppBar)
