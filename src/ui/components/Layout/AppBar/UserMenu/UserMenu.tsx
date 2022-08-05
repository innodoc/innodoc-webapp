import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material'
import { MouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Icon from '@/ui/components/common/Icon'

import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggler from './ThemeToggler'

function UserMenu() {
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const onOpenMenu = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)

  const openUserMenuLabel = t('header.openUserMenu')

  return (
    <Box sx={{ flexGrow: 0, ml: 1 }}>
      <Tooltip arrow title={openUserMenuLabel} placement="left">
        <IconButton
          aria-controls="user-menu"
          aria-label={openUserMenuLabel}
          color="inherit"
          onClick={onOpenMenu}
        >
          <Icon name="mdi:account-circle" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id="menu-appbar"
        keepMounted
        MenuListProps={{ dense: true }}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        sx={{ mt: '45px' }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <LanguageSwitcher />
        <ThemeToggler />
        <Divider sx={{ mt: 0.7 }} />
        <MenuItem>
          <ListItemIcon>
            <Icon name="mdi:login" />
          </ListItemIcon>
          <ListItemText>Login</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default UserMenu
