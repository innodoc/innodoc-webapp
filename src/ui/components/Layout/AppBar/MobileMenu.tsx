import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { selectNavPages } from '@/store/selectors/content'
import { selectUrlWithoutLocale } from '@/store/selectors/ui'
import Icon from '@/ui/components/common/Icon'
import Link, { PageLink } from '@/ui/components/common/Link'
import { useSelector } from '@/ui/hooks/store'
import { pageUrl } from '@/utils/url'

import otherPages from './otherPages'

function MobileMenu() {
  const { t } = useTranslation()

  const pages = useSelector(selectNavPages)
  const urlWithoutLocale = useSelector(selectUrlWithoutLocale)

  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const onOpenMenu = () => setMenuOpen(true)

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
        <Icon name="mdi:menu" />
      </IconButton>
      <SwipeableDrawer anchor="left" open={menuOpen} onOpen={openDrawer} onClose={closeDrawer}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={closeDrawer}>
              <ListItemIcon>
                <Icon name="mdi:chevron-left" />
              </ListItemIcon>
              <ListItemText primary={t('nav.close')} />
            </ListItemButton>
          </ListItem>
          <Divider />
          {pages.map(({ id, icon, title, shortTitle }) => (
            <ListItem disablePadding key={id} onClick={closeDrawer}>
              <ListItemButton
                component={PageLink}
                pageId={id}
                selected={urlWithoutLocale === pageUrl(id)}
              >
                {icon !== undefined ? (
                  <ListItemIcon>
                    <Icon name={icon} />
                  </ListItemIcon>
                ) : null}
                <ListItemText primary={shortTitle || title} />
              </ListItemButton>
            </ListItem>
          ))}
          {otherPages.map(({ icon, label, to }) => (
            <ListItem disablePadding key={to} onClick={closeDrawer}>
              <ListItemButton component={Link} to={to} selected={urlWithoutLocale === to}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={t(label)} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </SwipeableDrawer>
    </Box>
  )
}

export default MobileMenu
