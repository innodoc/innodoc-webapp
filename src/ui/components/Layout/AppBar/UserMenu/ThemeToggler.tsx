import { DarkMode as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material'
import { PaletteMode } from '@mui/material'
import { type ElementType, type MouseEvent, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import MenuToggleButtonGroup, { type Option } from '@/ui/components/common/MenuToggleButtonGroup'
import SwitchableThemeContext from '@/ui/contexts/SwitchableThemeContext'

function ThemeIcon({ icon: Icon }: { icon: ElementType }) {
  return <Icon fontSize="small" />
}

function ThemeToggler() {
  const { t } = useTranslation()
  const { paletteMode, setPaletteMode } = useContext(SwitchableThemeContext)

  const onChange = (event: MouseEvent, newPaletteMode: string) => {
    if (newPaletteMode !== null) {
      setPaletteMode(newPaletteMode as PaletteMode)
    }
  }

  const options: Option[] = [
    {
      component: <ThemeIcon icon={DarkModeIcon} />,
      label: t('common.theme.dark'),
      value: 'dark',
    },
    {
      component: <ThemeIcon icon={LightModeIcon} />,
      label: t('common.theme.light'),
      value: 'light',
    },
  ]

  return (
    <MenuToggleButtonGroup
      onChange={onChange}
      options={options}
      tooltipText={t('common.theme.switch')}
      value={paletteMode}
    />
  )
}

export default ThemeToggler
