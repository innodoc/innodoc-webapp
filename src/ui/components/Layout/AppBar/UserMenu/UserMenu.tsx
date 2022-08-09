import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { type MouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Icon from '@/ui/components/common/Icon'

import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggler from './ThemeToggler'

function UserMenu() {
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const theme = useTheme()
  const smDownMatches = useMediaQuery(theme.breakpoints.down('sm'))
  const openUserMenuLabel = t('nav.openUserMenu')

  const onOpenMenu = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)

  const themeAndLanguageSwitcher = smDownMatches
    ? [
        <LanguageSwitcher key="languageSwitcher" />,
        <ThemeToggler key="themeToggler" />,
        <Divider key="divider" sx={{ mt: 0.7 }} />,
      ]
    : null

  return (
    <Box sx={{ flexGrow: 0, ml: 1 }}>
      <Tooltip arrow title={openUserMenuLabel}>
        <IconButton
          aria-controls="appbar-user-menu"
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
        id="appbar-user-menu"
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
        {themeAndLanguageSwitcher}
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
