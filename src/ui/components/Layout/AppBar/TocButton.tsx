import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import Icon from '#ui/components/common/Icon'
import Toc from '#ui/components/toc/Toc/Toc'

import DrawerButton from './common/DrawerButton'

function TocButton() {
  const { t } = useTranslation()

  return (
    <DrawerButton
      anchor="right"
      drawerProps={{ sx: (theme) => ({ zIndex: `calc(${theme.vars.zIndex.appBar} - 1)` }) }}
      iconName="mdi:table-of-contents"
      id="appbar-toc-menu"
      title={t('builtinPages.toc.title')}
    >
      {(close) => (
        <>
          <Toolbar variant="dense" sx={{ visibility: 'hidden' }} />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={close}>
                <ListItemText primary={t('common.close')} />
                <ListItemIcon>
                  <Icon name="mdi:chevron-right" />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <Toc />
            </ListItem>
          </List>
        </>
      )}
    </DrawerButton>
  )
}

export default TocButton
