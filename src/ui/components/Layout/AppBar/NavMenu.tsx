import { Button, type ButtonProps, Stack, styled } from '@mui/material'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import useGenerateUrl from '#routes/useGenerateUrl'
import Icon from '#ui/components/common/Icon'
import InternalLink from '#ui/components/common/link/InternalLink'
import PageLink from '#ui/components/common/link/PageLink'
import useIsActiveLink from '#ui/hooks/useIsActiveLink'
import useSelectLinkedPages from '#ui/hooks/useSelectLinkedPages'

import otherPages from './otherPages'

const otherPagesNav = otherPages.filter((page) => page.linked.includes('nav'))

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
  const generateUrl = useGenerateUrl()
  const { t } = useTranslation()
  const isActiveLink = useIsActiveLink()
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
          className={
            isActiveLink({ routeName: 'app:page', pageSlug: page.slug }) ? 'active' : undefined
          }
          component={PageLink}
          key={page.slug}
          page={page}
          startIcon={page.icon !== undefined ? <Icon name={page.icon} /> : undefined}
        >
          {page.shortTitle || page.title}
        </StyledNavButton>
      ))}
      {otherPagesNav.map(({ icon, title, to }) => {
        const routeInfo = { routeName: to }
        return (
          <StyledNavButton
            className={isActiveLink(routeInfo) ? 'active' : undefined}
            component={InternalLink}
            key={to}
            startIcon={icon}
            to={generateUrl(routeInfo)}
          >
            {t(title)}
          </StyledNavButton>
        )
      })}
    </Stack>
  )
}

export default NavMenu
