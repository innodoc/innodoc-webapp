import { Button, Stack, styled } from '@mui/material'

import { selectNavPages } from '@/store/selectors/content'
import { PageLink } from '@/ui/components/common/Link'
import { useSelector } from '@/ui/hooks/store'

const generalPages = [
  {
    href: '/toc',
    icon: 'toc',
    id: 'toc',
    title: 'TOC',
  },
]

const NavButton = styled(Button)({
  color: 'rgb(255 255 255 / 80%)',
  textDecoration: 'underline',
  textDecorationColor: 'rgb(255 255 255 / 0%)',
  textTransform: 'inherit',
  transitionProperty: 'background-color, box-shadow, border-color, color, text-decoration-color',
  '&:hover': {
    color: 'white',
    textDecoration: 'underline',
    textDecorationColor: 'rgb(255 255 255 / 0%)',
  },
  '&.active': {
    color: 'white',
    textDecorationColor: 'rgb(255 255 255 / 100%)',
  },
})

function NavMenu() {
  const coursePages = useSelector(selectNavPages)
  const pages = [...coursePages, ...generalPages]

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
      {pages.map(({ id, icon, title }) => (
        <NavButton component={PageLink} key={id} pageId={id} size="small" startIcon={icon}>
          {title}
        </NavButton>
      ))}
    </Stack>
  )
}

export default NavMenu
