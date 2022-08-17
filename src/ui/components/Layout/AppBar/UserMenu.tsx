import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  type PaletteMode,
  Tooltip,
} from '@mui/material'
import { type MouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { selectPaletteMode } from '@/store/selectors/ui'
import { changeCustomPaletteMode } from '@/store/slices/uiSlice'
import Icon from '@/ui/components/common/Icon'
import InternalLink from '@/ui/components/common/link/InternalLink'
import MenuItemCaption from '@/ui/components/common/MenuItemCaption'
import MenuItemsLanguages from '@/ui/components/Layout/AppBar/MenuItemsLanguages'
import { useDispatch, useSelector } from '@/ui/hooks/store'

function UserMenu() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const currentPaletteMode = useSelector(selectPaletteMode)
  const openUserMenuLabel = t('nav.openUserMenu')

  const onOpenMenu = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)

  const onClickPaletteMode = (mode: PaletteMode) => {
    dispatch(changeCustomPaletteMode(mode))
  }

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
      </Menu>
    </Box>
  )
}

export default UserMenu
