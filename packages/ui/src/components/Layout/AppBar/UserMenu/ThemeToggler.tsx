import { DarkMode as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material'
import { PaletteMode } from '@mui/material'
import { type ElementType, type MouseEvent, useContext } from 'react'

import { SwitchableThemeContext } from '../../../../ui'
import MenuToggleButtonGroup, { Option } from '../../../common/MenuToggleButtonGroup'

function ThemeIcon({ icon: Icon }: { icon: ElementType }) {
  return <Icon fontSize="small" />
}

function ThemeToggler() {
  const { paletteMode, setPaletteMode } = useContext(SwitchableThemeContext)

  const onChange = (event: MouseEvent, newPaletteMode: string) => {
    if (newPaletteMode !== null) {
      setPaletteMode(newPaletteMode as PaletteMode)
    }
  }

  const options: Option[] = [
    {
      component: <ThemeIcon icon={DarkModeIcon} />,
      label: 'Select dark theme',
      value: 'dark',
    },
    {
      component: <ThemeIcon icon={LightModeIcon} />,
      label: 'Select light theme',
      value: 'light',
    },
  ]

  return (
    <MenuToggleButtonGroup
      onChange={onChange}
      options={options}
      tooltipText="Switch theme"
      value={paletteMode}
    />
  )
}

export default ThemeToggler