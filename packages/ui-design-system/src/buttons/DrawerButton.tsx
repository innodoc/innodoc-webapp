import { Box, IconButton, SwipeableDrawer, Tooltip } from '@mui/material'
import { useState } from 'react'
import type { BoxProps, SwipeableDrawerProps } from '@mui/material'
import type { ReactNode } from 'react'

import { Icon } from '#misc'
import type { IconProps } from '#misc'

const defaultBoxProps = { sx: {} }
const defaultDrawerProps = {}

function DrawerButton({
  anchor,
  boxProps = defaultBoxProps,
  children,
  drawerProps = defaultDrawerProps,
  iconName,
  id,
  title,
}: DrawerButtonProps) {
  const { sx: boxSx, ...restBoxProps } = boxProps

  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const onClick = () => {
    setMenuOpen((prev) => !prev)
  }
  const open = () => {
    setMenuOpen(true)
  }
  const close = () => {
    setMenuOpen(false)
  }

  return (
    <Box {...restBoxProps} flexGrow={0} sx={boxSx}>
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

interface DrawerButtonProps {
  anchor: SwipeableDrawerProps['anchor']
  boxProps?: BoxProps
  children: (close: () => void) => ReactNode
  drawerProps?: Omit<SwipeableDrawerProps, 'onClose' | 'onOpen' | 'open'>
  iconName: IconProps['name']
  id: string
  title: string
}

export default DrawerButton
