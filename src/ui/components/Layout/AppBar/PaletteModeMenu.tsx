import { Box, IconButton, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { selectPaletteMode } from '@/store/selectors/ui'
import { changeCustomPaletteMode } from '@/store/slices/uiSlice'
import Icon from '@/ui/components/common/Icon'
import { useDispatch, useSelector } from '@/ui/hooks/store'

function PaletteModeMenu() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const currentPaletteMode = useSelector(selectPaletteMode)

  const icon =
    currentPaletteMode === 'dark' ? (
      <Icon name="mdi:weather-night" />
    ) : (
      <Icon name="mdi:weather-sunny" />
    )
  const paletteModeMenuLabel = t('nav.paletteMode.switch')

  const onClick = () => {
    dispatch(changeCustomPaletteMode(currentPaletteMode === 'dark' ? 'light' : 'dark'))
  }

  return (
    <Box sx={{ flexGrow: 0, ml: 1 }}>
      <Tooltip arrow title={paletteModeMenuLabel}>
        <IconButton aria-label={paletteModeMenuLabel} color="inherit" onClick={onClick}>
          {icon}
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default PaletteModeMenu
