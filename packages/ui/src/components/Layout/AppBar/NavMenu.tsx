import { Button, Stack } from '@mui/material'

import type { Page } from '@innodoc/types'

function NavMenu({ pages }: NavMenuProps) {
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
      {pages.map(({ id, icon, title }: Page) => (
        <Button
          key={id}
          startIcon={icon}
          sx={{
            color: 'white',
            textTransform: 'inherit',
          }}
        >
          {title}
        </Button>
      ))}
    </Stack>
  )
}

type NavMenuProps = { pages: Page[] }

export default NavMenu
