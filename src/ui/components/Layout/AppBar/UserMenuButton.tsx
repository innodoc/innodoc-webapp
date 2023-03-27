import { Box, Divider, ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

import Icon from '#ui/components/common/Icon'
import AppLink from '#ui/components/common/link/AppLink'
import MenuItemCaption from '#ui/components/common/MenuItemCaption'

import MenuButton from './common/MenuButton'
import MenuItemsLanguages from './LanguageMenuButton/MenuItemsLanguages'

function UserMenuItems() {
  const { t } = useTranslation()
  const { mode, setMode } = useColorScheme()

  return (
    <>
      <MenuItem component={AppLink} routeInfo={{ routeName: 'app:user:login' }}>
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
    </>
  )
}

function UserMenuButton() {
  const { t } = useTranslation()

  return (
    <MenuButton iconName="mdi:account-circle" id="appbar-user-menu" title={t('nav.openUserMenu')}>
      {() => <UserMenuItems />}
    </MenuButton>
  )
}

export default UserMenuButton
