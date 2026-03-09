import { Button, type ButtonProps, Stack, styled } from '@mui/material'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { AppLink, PageLink } from '@innodoc/ui-design-system/links'
import { Icon } from '@innodoc/ui-design-system/misc'
import pageLinks from '@innodoc/ui-design-system/page-links'
import { useRouteManager, useSelectLinkedPages } from '@innodoc/ui-shared/hooks'

const pageLinksNav = pageLinks.filter((page) => page.linked?.includes('nav'))

const NavButton = forwardRef<HTMLButtonElement | null, ButtonProps>(function NavButton(props, ref) {
  return <Button color="inherit" ref={ref} size="small" {...props} />
})

const StyledNavButton = styled(NavButton)(({ theme }) => ({
  lineHeight: theme.spacing(2),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  textDecoration: 'underline',
  textDecorationColor: `rgb(${theme.vars.palette.text.primaryChannel} / 0%)`,
  textTransform: 'inherit',
  transitionProperty: 'background-color, box-shadow, border-color, color, text-decoration-color',
  whiteSpace: 'nowrap',
  '&:hover': { textDecoration: 'underline' },
  '&.active': { textDecoration: 'underline' },
})) as typeof Button

function NavMenu() {
  const { isActiveRoute } = useRouteManager()
  const { t } = useTranslation()
  const { pages } = useSelectLinkedPages('nav')

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        display: { xs: 'none', md: 'flex' },
        flexGrow: 1,
        justifyContent: 'center',
      }}
    >
      {pages.map((page) => (
        <StyledNavButton
          className={isActiveRoute({ name: 'app:course:page', pageSlug: page.slug }) ? 'active' : undefined}
          component={PageLink}
          key={page.slug}
          page={page}
          startIcon={page.icon === null ? undefined : <Icon name={page.icon} />}
        >
          {page.shortTitle ?? page.title}
        </StyledNavButton>
      ))}
      {pageLinksNav.map(({ icon, title, routeName }) => (
        <StyledNavButton
          className={isActiveRoute({ name: routeName }) ? 'active' : undefined}
          component={AppLink}
          key={routeName}
          startIcon={icon}
          routeInfo={{ name: routeName }}
        >
          {title ? t(title) : undefined}
        </StyledNavButton>
      ))}
    </Stack>
  )
}

export default NavMenu
