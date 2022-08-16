import type { PaletteMode } from '@mui/material'
import { type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { selectPaletteMode } from '@/store/selectors/ui'
import { changeCustomPaletteMode } from '@/store/slices/uiSlice'
import Icon from '@/ui/components/common/Icon'
import MenuToggleButtonGroup, { type Option } from '@/ui/components/common/MenuToggleButtonGroup'
import { useDispatch, useSelector } from '@/ui/hooks/store'

function PaletteModeToggler() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const paletteMode = useSelector(selectPaletteMode)

  const onChange = (event: MouseEvent, newPaletteMode: string | null) => {
    if (newPaletteMode !== null) {
      dispatch(changeCustomPaletteMode(newPaletteMode as PaletteMode))
    }
  }

  const options: Option[] = [
    {
      component: <Icon fontSize="small" name="mdi:weather-night" />,
      label: t('nav.paletteMode.dark'),
      value: 'dark',
    },
    {
      component: <Icon fontSize="small" name="mdi:weather-sunny" />,
      label: t('nav.paletteMode.light'),
      value: 'light',
    },
  ]

  return (
    <MenuToggleButtonGroup
      onChange={onChange}
      options={options}
      tooltipText={t('nav.paletteMode.switch')}
      value={paletteMode}
    />
  )
}

export default PaletteModeToggler
