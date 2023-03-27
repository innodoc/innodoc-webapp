import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useTranslation } from 'react-i18next'

import builtInPages from '#ui/components/common/builtInPages'
import Icon from '#ui/components/common/Icon'
import AppLink from '#ui/components/common/link/AppLink'
import PageLink from '#ui/components/common/link/PageLink'
import useSelectLinkedPages from '#ui/hooks/store/useSelectLinkedPages'
import useRouteManager from '#ui/hooks/useRouteManager'

import DrawerButton from './common/DrawerButton'

const builtInPagesNav = builtInPages.filter((page) => page.linked?.includes('nav'))

function MobileNavButton() {
  const { isActiveRoute } = useRouteManager()
  const { t } = useTranslation()

  const { pages } = useSelectLinkedPages('nav')

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
                selected={isActiveRoute({ routeName: 'app:page', pageSlug: page.slug })}
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
          {builtInPagesNav.map(({ icon, title, routeName }) => (
            <ListItem disablePadding key={routeName} onClick={close}>
              <ListItemButton
                component={AppLink}
                routeInfo={{ routeName }}
                selected={isActiveRoute({ routeName })}
              >
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
