import { Button, Stack } from '@mui/material'

import { selectPages } from '@/store/selectors/content'
import { useSelector } from '@/ui/hooks/store'

function NavMenu() {
  const pages = useSelector(selectPages)

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

export default NavMenu
