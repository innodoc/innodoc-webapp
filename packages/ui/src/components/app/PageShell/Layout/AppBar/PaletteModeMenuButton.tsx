import { Box, IconButton, Tooltip, useColorScheme } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Icon } from '#components/common'

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
