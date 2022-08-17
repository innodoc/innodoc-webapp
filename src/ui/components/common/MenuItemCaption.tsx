import { ListItemIcon, ListItemText, MenuItem, styled } from '@mui/material'

import Icon from './Icon'

const StyledMenuItem = styled(MenuItem)({
  cursor: 'auto',
  '&:hover': {
    backgroundColor: 'inherit',
  },
})

function MenuItemCaption({ iconName, text }: MenuItemCaptionProps) {
  const listItemIcon =
    iconName !== undefined ? (
      <ListItemIcon>
        <Icon name={iconName} />
      </ListItemIcon>
    ) : null

  return (
    <StyledMenuItem disableRipple>
      {listItemIcon}
      <ListItemText
        primary={text}
        primaryTypographyProps={{ fontWeight: 'bold', variant: 'caption' }}
      />
    </StyledMenuItem>
  )
}

type MenuItemCaptionProps = {
  iconName?: string
  text: string
}

export default MenuItemCaption
