import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { useRouteManager, useSelectLinkedPages } from '@innodoc/hooks'

import { DrawerButton } from '#common/buttons'
import { AppLink, PageLink } from '#common/links'
import { Icon } from '#common/misc'
import pageLinks from '#pageLinks'

const pageLinksNav = pageLinks.filter((page) => page.linked?.includes('nav'))

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
                selected={isActiveRoute({ name: 'app:course:page', pageSlug: page.slug })}
              >
                {page.icon ? (
                  <ListItemIcon>
                    <Icon name={page.icon} />
                  </ListItemIcon>
                ) : null}
                <ListItemText primary={page.shortTitle ?? page.title} />
              </ListItemButton>
            </ListItem>
          ))}
          {pageLinksNav.map(({ icon, title, routeName }) => (
            <ListItem disablePadding key={routeName} onClick={close}>
              <ListItemButton
                component={AppLink}
                routeInfo={{ name: routeName }}
                selected={isActiveRoute({ name: routeName })}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                {title ? <ListItemText primary={t(title)} /> : <>&nbsp;</>}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </DrawerButton>
  )
}

export default MobileNavButton
