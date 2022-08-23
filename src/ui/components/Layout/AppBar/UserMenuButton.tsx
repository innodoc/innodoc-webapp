import { Box, Divider, ListItemIcon, ListItemText, MenuItem, type PaletteMode } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { selectPaletteMode } from '@/store/selectors/ui'
import { changeCustomPaletteMode } from '@/store/slices/uiSlice'
import Icon from '@/ui/components/common/Icon'
import InternalLink from '@/ui/components/common/link/InternalLink'
import MenuItemCaption from '@/ui/components/common/MenuItemCaption'
import MenuItemsLanguages from '@/ui/components/Layout/AppBar/MenuItemsLanguages'
import { useDispatch, useSelector } from '@/ui/hooks/store'

import MenuButton from './common/MenuButton'

function UserMenuButton() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const currentPaletteMode = useSelector(selectPaletteMode)

  const onClickPaletteMode = (mode: PaletteMode) => {
    dispatch(changeCustomPaletteMode(mode))
  }

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
        <MenuItem
          onClick={() => onClickPaletteMode('light')}
          selected={currentPaletteMode === 'light'}
        >
          <ListItemText inset primary={t('nav.paletteMode.light')} />
        </MenuItem>
        <MenuItem
          onClick={() => onClickPaletteMode('dark')}
          selected={currentPaletteMode === 'dark'}
        >
          <ListItemText inset primary={t('nav.paletteMode.dark')} />
        </MenuItem>
      </Box>
    </MenuButton>
  )
}

export default UserMenuButton
