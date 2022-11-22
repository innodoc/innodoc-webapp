import {
  Box,
  type BoxProps,
  IconButton,
  SwipeableDrawer,
  type SwipeableDrawerProps,
  Tooltip,
} from '@mui/material'
import { type ReactNode, useState } from 'react'

import Icon, { type IconProps } from '#ui/components/common/Icon'

function DrawerButton({
  anchor,
  boxProps = { sx: {} },
  children,
  drawerProps = {},
  iconName,
  id,
  title,
}: DrawerButtonProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const onClick = () => setMenuOpen((prev) => !prev)
  const open = () => setMenuOpen(true)
  const close = () => setMenuOpen(false)

  return (
    <Box sx={{ flexGrow: 0, ...boxProps.sx }} {...boxProps}>
      <Tooltip arrow title={title}>
        <IconButton aria-controls={id} aria-label={title} color="inherit" onClick={onClick}>
          <Icon name={iconName} />
        </IconButton>
      </Tooltip>
      <SwipeableDrawer
        anchor={anchor}
        id={id}
        onClose={close}
        onOpen={open}
        open={menuOpen}
        PaperProps={{ sx: { width: 300 } }}
        {...drawerProps}
      >
        {children(close)}
      </SwipeableDrawer>
    </Box>
  )
}

type DrawerButtonProps = {
  anchor: SwipeableDrawerProps['anchor']
  boxProps?: BoxProps
  children: (close: () => void) => ReactNode
  drawerProps?: Omit<SwipeableDrawerProps, 'onClose' | 'onOpen' | 'open'>
  iconName: IconProps['name']
  id: string
  title: string
}

export default DrawerButton
