import type { PaletteMode } from '@mui/material'
import { type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { selectTheme } from '@/store/selectors/ui'
import { changeTheme } from '@/store/slices/uiSlice'
import Icon from '@/ui/components/common/Icon'
import MenuToggleButtonGroup, { type Option } from '@/ui/components/common/MenuToggleButtonGroup'
import { useDispatch, useSelector } from '@/ui/hooks/store'

function ThemeToggler() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const selectedTheme = useSelector(selectTheme)

  const onChange = (event: MouseEvent, newTheme: string | null) => {
    if (newTheme !== null) {
      dispatch(changeTheme(newTheme as PaletteMode))
    }
  }

  const options: Option[] = [
    {
      component: <Icon fontSize="small" name="weather-night" />,
      label: t('common.theme.dark'),
      value: 'dark',
    },
    {
      component: <Icon fontSize="small" name="weather-sunny" />,
      label: t('common.theme.light'),
      value: 'light',
    },
  ]

  return (
    <MenuToggleButtonGroup
      onChange={onChange}
      options={options}
      tooltipText={t('common.theme.switch')}
      value={selectedTheme}
    />
  )
}

export default ThemeToggler
