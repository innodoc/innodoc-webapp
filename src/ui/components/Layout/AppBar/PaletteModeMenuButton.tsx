import { Box, IconButton, Tooltip } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

import Icon from '@/ui/components/common/Icon'

function PaletteModeMenuButton() {
  const { t } = useTranslation()
  const { mode, setMode } = useColorScheme()

  const paletteModeMenuLabel = t('nav.paletteMode.title')

  const onClick = () => {
    setMode(mode === 'dark' ? 'light' : 'dark')
  }

  return (
    <Box sx={{ flexGrow: 0, ml: 1 }}>
      <Tooltip arrow title={paletteModeMenuLabel}>
        <IconButton aria-label={paletteModeMenuLabel} color="inherit" onClick={onClick}>
          <Icon name="mdi:theme-light-dark" />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default PaletteModeMenuButton
