import { Box, Divider, ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import { useColorScheme } from '@mui/material/styles/index.js'
import { useTranslation } from 'react-i18next'

import Icon from '@/ui/components/common/Icon'
import InternalLink from '@/ui/components/common/link/InternalLink'
import MenuItemCaption from '@/ui/components/common/MenuItemCaption'
import MenuItemsLanguages from '@/ui/components/Layout/AppBar/MenuItemsLanguages'

import MenuButton from './common/MenuButton'

function UserMenuButton() {
  const { t } = useTranslation()
  const { mode, setMode } = useColorScheme()

  return (
    <MenuButton iconName="mdi:account-circle" id="appbar-user-menu" title={t('nav.openUserMenu')}>
      <MenuItem component={InternalLink} to="/login">
        <ListItemIcon>
          <Icon name="mdi:login" />
        </ListItemIcon>
        <ListItemText primary={t('nav.login')} />
      </MenuItem>
      <Box sx={{ display: { xs: 'inherit', sm: 'none' } }}>
        <Divider />
        <MenuItemCaption iconName="mdi:translate" text={t('nav.language')} />
        <MenuItemsLanguages inset />
        <Divider />
        <MenuItemCaption iconName="mdi:theme-light-dark" text={t('nav.paletteMode.title')} />
        <MenuItem onClick={() => setMode('light')} selected={mode === 'light'}>
          <ListItemText inset primary={t('nav.paletteMode.light')} />
        </MenuItem>
        <MenuItem onClick={() => setMode('dark')} selected={mode === 'dark'}>
          <ListItemText inset primary={t('nav.paletteMode.dark')} />
        </MenuItem>
      </Box>
    </MenuButton>
  )
}

export default UserMenuButton
