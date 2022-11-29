import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useTranslation } from 'react-i18next'

import useSelectLinkedPages from '#store/hooks/useSelectLinkedPages'
import { selectUrlWithoutLocale } from '#store/slices/uiSlice'
import Icon from '#ui/components/common/Icon'
import InternalLink from '#ui/components/common/link/InternalLink'
import PageLink from '#ui/components/common/link/PageLink'
import { useSelector } from '#ui/hooks/store'
import { getPageUrl } from '#utils/url'

import DrawerButton from './common/DrawerButton'
import otherPages from './otherPages'

function MobileNavButton() {
  const { t } = useTranslation()

  const { pages } = useSelectLinkedPages('nav')
  const urlWithoutLocale = useSelector(selectUrlWithoutLocale)

  return (
    <DrawerButton
      anchor="left"
      boxProps={{ display: { xs: 'flex', md: 'none' }, ml: -1 }}
      iconName="mdi:menu"
      id="appbar-mobile-menu"
      title={t('nav.openNav')}
    >
      {(close) => (
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={close}>
              <ListItemIcon>
                <Icon name="mdi:chevron-left" />
              </ListItemIcon>
              <ListItemText primary={t('common.close')} />
            </ListItemButton>
          </ListItem>
          <Divider />
          {pages.map((page) => (
            <ListItem disablePadding key={page.id} onClick={close}>
              <ListItemButton
                component={PageLink}
                page={page}
                selected={urlWithoutLocale === getPageUrl(page.slug)}
              >
                {page.icon !== undefined ? (
                  <ListItemIcon>
                    <Icon name={page.icon} />
                  </ListItemIcon>
                ) : null}
                <ListItemText primary={page.shortTitle || page.title} />
              </ListItemButton>
            </ListItem>
          ))}
          {otherPages.map(({ icon, title, to }) => (
            <ListItem disablePadding key={to} onClick={close}>
              <ListItemButton component={InternalLink} to={to} selected={urlWithoutLocale === to}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={t(title)} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </DrawerButton>
  )
}

export default MobileNavButton
