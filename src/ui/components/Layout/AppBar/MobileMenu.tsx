import { ChevronLeft as ChevronLeftIcon, Menu as MenuIcon } from '@mui/icons-material'
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  SwipeableDrawer,
} from '@mui/material'
import { useState } from 'react'

import { selectPages } from '@/store/selectors/content'
import { useSelector } from '@/ui/hooks/store'

function MobileMenu() {
  const pages = useSelector(selectPages)

  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const onOpenMenu = () => setMenuOpen(true)

  const onClickMenuItem = () => {
    // TODO navigate
    setMenuOpen(false)
  }

  const openDrawer = () => setMenuOpen(true)
  const closeDrawer = () => setMenuOpen(false)

  return (
    <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' }, mr: 2 }}>
      <IconButton
        aria-label="Open navigation"
        aria-controls="menu-appbar"
        onClick={onOpenMenu}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer anchor="left" open={menuOpen} onOpen={openDrawer} onClose={closeDrawer}>
        <MenuItem onClick={closeDrawer}>
          <ListItemIcon>
            <ChevronLeftIcon />
          </ListItemIcon>
          <ListItemText>Close</ListItemText>
        </MenuItem>
        <Divider />
        {pages.map(({ id, title }) => (
          <MenuItem key={id} onClick={onClickMenuItem}>
            <ListItemText>{title}</ListItemText>
          </MenuItem>
        ))}
      </SwipeableDrawer>
    </Box>
  )
}

export default MobileMenu
