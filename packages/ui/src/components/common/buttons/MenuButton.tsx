import { Box, IconButton, Menu, Tooltip } from '@mui/material'
import { type MouseEvent, type ReactNode, useState } from 'react'

import { Icon, type IconProps } from '#components/common/misc'

function MenuButton({ children, iconName, id, title }: MenuButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{ flexGrow: 0, ml: 1 }}>
      <Tooltip arrow title={title}>
        <IconButton aria-controls={id} aria-label={title} color="inherit" onClick={handleClick}>
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
        onClose={handleClose}
        sx={{ mt: (theme) => theme.spacing(5) }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {children(handleClose)}
      </Menu>
    </Box>
  )
}

interface MenuButtonProps {
  children: (closeMenu: () => void) => ReactNode
  iconName: IconProps['name']
  id: string
  title: string
}

export default MenuButton
