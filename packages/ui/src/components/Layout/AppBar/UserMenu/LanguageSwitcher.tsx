import { useTranslation } from 'next-i18next'
import type { MouseEvent } from 'react'

import { changeLocale, useSelector } from '@innodoc/store'
import { selectLocale, selectLocales } from '@innodoc/store/src/selectors/ui'
import { isNotNull, Locale } from '@innodoc/types'

import MenuToggleButtonGroup from '../../../common/MenuToggleButtonGroup'

function LanguageSwitcher() {
  const { t } = useTranslation()
  const locale = useSelector(selectLocale)
  const locales = useSelector(selectLocales)

  if (isNotNull(locale)) {
    const onChange = (event: MouseEvent, newLocale: Locale) => {
      console.log(newLocale)
      if (newLocale !== null) {
        changeLocale(newLocale)
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
        tooltipText="Change language"
        value={locale}
      />
    )
  }

  return null
}

export default LanguageSwitcher
