import { Button, Stack } from '@mui/material'

function NavMenu() {
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
      {/* {pages.map(({ id, icon, title }: Page) => (
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
      ))} */}
    </Stack>
  )
}

export default NavMenu
