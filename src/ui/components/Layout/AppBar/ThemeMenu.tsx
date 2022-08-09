import { Box, IconButton, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { selectTheme } from '@/store/selectors/ui'
import { changeTheme } from '@/store/slices/uiSlice'
import Icon from '@/ui/components/common/Icon'
import { useDispatch, useSelector } from '@/ui/hooks/store'

function ThemeMenu() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const currentTheme = useSelector(selectTheme)

  const icon =
    currentTheme === 'dark' ? <Icon name="mdi:weather-night" /> : <Icon name="mdi:weather-sunny" />
  const themeMenuLabel = t('nav.theme.switch')

  return (
    <Box sx={{ flexGrow: 0, ml: 1 }}>
      <Tooltip arrow title={themeMenuLabel}>
        <IconButton
          aria-label={themeMenuLabel}
          color="inherit"
          onClick={() => dispatch(changeTheme(currentTheme === 'dark' ? 'light' : 'dark'))}
        >
          {icon}
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default ThemeMenu
