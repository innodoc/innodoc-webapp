import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { selectLocales } from '@/store/selectors/content'
import { selectLocale } from '@/store/selectors/ui'
import { changeLocale } from '@/store/slices/uiSlice'
import { Locale } from '@/types/common'
import MenuToggleButtonGroup from '@/ui/components/common/MenuToggleButtonGroup'
import { useDispatch, useSelector } from '@/ui/hooks/store'

function LanguageSwitcher() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const locale = useSelector(selectLocale)
  const locales = useSelector(selectLocales)

  if (locale !== null) {
    const onChange = (event: MouseEvent, newLocale: Locale) => {
      if (newLocale !== null) {
        dispatch(changeLocale(newLocale))
      }
    }

    const options = locales.map((locale) => ({
      component: t(`languages.${locale}`),
      label: t(`languages.${locale}`),
      value: locale,
    }))

    return (
      <MenuToggleButtonGroup
        onChange={onChange}
        options={options}
        tooltipText={t('common.changeLanguage')}
        value={locale}
      />
    )
  }

  return null
}

export default LanguageSwitcher
