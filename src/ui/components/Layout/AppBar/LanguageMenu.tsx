import { Box, IconButton, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material'
import { type MouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { selectLocales } from '@/store/selectors/content'
import { selectLocale } from '@/store/selectors/ui'
import { changeLocale } from '@/store/slices/uiSlice'
import Icon from '@/ui/components/common/Icon'
import { useDispatch, useSelector } from '@/ui/hooks/store'

function LanguageMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const currentLocale = useSelector(selectLocale)
  const locales = useSelector(selectLocales)

  const onOpenMenu = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)

  const languageMenuLabel = t('nav.language')

  if (currentLocale === null) {
    return null
  }

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
        {locales.map((locale) => (
          <MenuItem
            key={locale}
            onClick={() => dispatch(changeLocale(locale))}
            selected={locale === currentLocale}
          >
            <ListItemText>{t(`languages.${locale}`)}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default LanguageMenu
