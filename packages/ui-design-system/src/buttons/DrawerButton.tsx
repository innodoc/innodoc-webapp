import type { BoxProps, SwipeableDrawerProps, SxProps, Theme } from '@mui/material'
import type { ReactNode } from 'react'
import { Box, IconButton, SwipeableDrawer, Tooltip } from '@mui/material'
import { useState } from 'react'
import { Icon } from '#misc'
import type { IconProps } from '#misc'

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

  const onClick = () => {
    setMenuOpen((prev) => !prev)
  }
  const open = () => {
    setMenuOpen(true)
  }
  const close = () => {
    setMenuOpen(false)
  }

  const paperSx = typeof drawerProps.slotProps?.paper === 'function' ? undefined : drawerProps.slotProps?.paper?.sx
  const paperSxArr: SxProps<Theme> = Array.isArray(paperSx) ? paperSx : [paperSx]

  const boxSx = boxProps.sx ?? []
  const boxSxArr: SxProps<Theme> = Array.isArray(boxSx) ? boxSx : [boxSx]

  return (
    <Box {...boxProps} sx={[{ flexGrow: 0 }, ...boxSxArr]}>
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
        {...drawerProps}
        slotProps={{
          ...drawerProps.slotProps,
          paper: {
            sx: [{ width: 300 }, ...paperSxArr],
          },
        }}
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
