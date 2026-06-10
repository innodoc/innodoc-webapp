import { ListItemIcon, ListItemText, MenuItem, styled } from '@mui/material'
import Icon from './Icon.js'

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
  iconName?: string
  text: string
}

export default MenuItemCaption
