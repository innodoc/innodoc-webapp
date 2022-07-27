import { DarkMode as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material'
import { PaletteMode, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material'
import { MouseEvent, useContext } from 'react'

import { SwitchableThemeContext } from '../../../../ui'

function ThemeToggler() {
  const { paletteMode, setPaletteMode } = useContext(SwitchableThemeContext)

  const onChange = (event: MouseEvent<HTMLElement>, newPaletteMode: PaletteMode) => {
    if (newPaletteMode !== null) {
      setPaletteMode(newPaletteMode)
    }
  }

  const iconSx = { px: 1, py: 0.5 }

  return (
    <Tooltip arrow placement="left" title="Switch theme">
      <ToggleButtonGroup
        exclusive
        onChange={onChange}
        size="small"
        sx={{ px: 2, py: 0 }}
        value={paletteMode}
      >
        <ToggleButton aria-label="Select dark theme" sx={iconSx} value="dark">
          <DarkModeIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton aria-label="Select light theme" sx={iconSx} value="light">
          <LightModeIcon fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Tooltip>
  )
}

export default ThemeToggler
