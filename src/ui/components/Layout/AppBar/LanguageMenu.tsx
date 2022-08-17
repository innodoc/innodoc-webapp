import { Box, IconButton, Menu, Tooltip } from '@mui/material'
import { type MouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Icon from '@/ui/components/common/Icon'

import MenuItemsLanguages from './MenuItemsLanguages'

function LanguageMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const { t } = useTranslation()

  const onOpenMenu = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)

  const languageMenuLabel = t('nav.language')

  return (
    <Box sx={{ flexGrow: 0, ml: 1 }}>
      <Tooltip arrow title={languageMenuLabel}>
        <IconButton
          aria-controls="appbar-language-menu"
          aria-label={languageMenuLabel}
          color="inherit"
          onClick={onOpenMenu}
        >
          <Icon name="mdi:translate" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id="appbar-language-menu"
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
        <MenuItemsLanguages />
      </Menu>
    </Box>
  )
}

export default LanguageMenu
