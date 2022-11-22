import { Box, IconButton, Menu, Tooltip } from '@mui/material'
import { type MouseEvent, useState, type ReactNode } from 'react'

import Icon, { type IconProps } from '#ui/components/common/Icon'

function MenuButton({ children, iconName, id, title }: MenuButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const onOpenMenu = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)

  return (
    <Box sx={{ flexGrow: 0, ml: 1 }}>
      <Tooltip arrow title={title}>
        <IconButton aria-controls={id} aria-label={title} color="inherit" onClick={onOpenMenu}>
          <Icon name={iconName} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={id}
        keepMounted
        MenuListProps={{ dense: true }}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        sx={{ mt: (theme) => theme.spacing(5) }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {children}
      </Menu>
    </Box>
  )
}

type MenuButtonProps = {
  children: ReactNode
  iconName: IconProps['name']
  id: string
  title: string
}

export default MenuButton
