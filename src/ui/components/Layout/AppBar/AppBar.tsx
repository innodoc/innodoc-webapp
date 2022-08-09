import {
  AppBar as MuiAppBar,
  Box,
  Container,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import LanguageMenu from './LanguageMenu'
import Logo from './Logo'
import MobileMenu from './MobileMenu'
import NavMenu from './NavMenu'
import ThemeMenu from './ThemeMenu'
import UserMenu from './UserMenu/UserMenu'

function AppBar() {
  const theme = useTheme()
  const smUpMatches = useMediaQuery(theme.breakpoints.up('sm'))

  const auxIconMenus = smUpMatches ? (
    <>
      <ThemeMenu />
      <LanguageMenu />
    </>
  ) : null

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
          {auxIconMenus}
          <UserMenu />
        </Toolbar>
      </Container>
    </MuiAppBar>
  )
}

export default AppBar
