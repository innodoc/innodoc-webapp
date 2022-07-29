import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import type { MouseEvent } from 'react'

import { useSelector } from '@innodoc/store'
import { selectLocale, selectLocales } from '@innodoc/store/src/selectors/ui'
import { isNotNull, Locale } from '@innodoc/types'

import MenuToggleButtonGroup from '../../../common/MenuToggleButtonGroup'

function LanguageSwitcher() {
  const { t } = useTranslation()
  const locale = useSelector(selectLocale)
  const locales = useSelector(selectLocales)
  const router = useRouter()
  const { pathname, asPath, query } = router

  if (isNotNull(locale)) {
    const onChange = (event: MouseEvent, newLocale: Locale) => {
      if (newLocale !== null) {
        void router.push({ pathname, query }, asPath, { locale: newLocale })
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
