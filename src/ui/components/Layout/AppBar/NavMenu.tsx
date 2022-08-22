import { Button, type ButtonProps, Stack, styled } from '@mui/material'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { selectNavPages } from '@/store/selectors/content/page'
import Icon from '@/ui/components/common/Icon'
import InternalLink from '@/ui/components/common/link/InternalLink'
import PageLink from '@/ui/components/common/link/PageLink'
import { useSelector } from '@/ui/hooks/store'

import { otherPagesNav } from './otherPages'

const NavButton = forwardRef<HTMLButtonElement | null, ButtonProps>(function NavButton(props, ref) {
  return <Button color="inherit" ref={ref} size="small" {...props} />
})

const StyledNavButton = styled(NavButton)({
  textDecoration: 'underline',
  textDecorationColor: 'rgb(255 255 255 / 0%)',
  textTransform: 'inherit',
  transitionProperty: 'background-color, box-shadow, border-color, color, text-decoration-color',
  '&:hover': {
    textDecoration: 'underline',
  },
  '&.active': {
    textDecoration: 'underline',
  },
}) as typeof Button

function NavMenu() {
  const { t } = useTranslation()
  const coursePages = useSelector(selectNavPages)

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        display: { xs: 'none', md: 'flex' },
        flexGrow: 1,
        justifyContent: 'center',
      }}
    >
      {coursePages.map(({ id, icon, title, shortTitle }) => (
        <StyledNavButton
          component={PageLink}
          key={id}
          pageId={id}
          startIcon={icon !== undefined ? <Icon name={icon} /> : undefined}
        >
          {shortTitle || title}
        </StyledNavButton>
      ))}
      {otherPagesNav.map(({ icon, title, to }) => (
        <StyledNavButton component={InternalLink} key={to} startIcon={icon} to={to}>
          {t(title)}
        </StyledNavButton>
      ))}
    </Stack>
  )
}

export default NavMenu
