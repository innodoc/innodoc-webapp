import { ListItemIcon, ListItemText, MenuItem, styled } from '@mui/material'
import Icon, { type IconProps } from './Icon.js'

const StyledMenuItem = styled(MenuItem)({
  cursor: 'auto',
  '&:hover': {
    backgroundColor: 'inherit',
  },
})

function MenuItemCaption({ iconName, text }: MenuItemCaptionProps) {
  const listItemIcon =
    iconName === undefined ? null : (
      <ListItemIcon>
        <Icon name={iconName} />
      </ListItemIcon>
    )

  return (
    <StyledMenuItem disableRipple>
      {listItemIcon}
      <ListItemText primary={text} slotProps={{ primary: { sx: { fontWeight: 'bold' }, variant: 'caption' } }} />
    </StyledMenuItem>
  )
}

interface MenuItemCaptionProps {
  iconName?: IconProps['name']
  text: string
}

export default MenuItemCaption
