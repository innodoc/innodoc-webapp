// import { useTranslation } from 'next-i18next'
// import { useRouter } from 'next/router'
import type { MouseEvent } from 'react'

import { useSelector } from '@/ui/hooks/store'
import { selectLocale, selectLocales } from '@/store/selectors/ui'
import { Locale } from '@/types/common'
import { isNotNull } from '@/types/utils'

import MenuToggleButtonGroup from '../../../common/MenuToggleButtonGroup'

function LanguageSwitcher() {
  // const { t } = useTranslation()
  const t = (s) => s
  const locale = useSelector(selectLocale)
  const locales = useSelector(selectLocales)
  // const router = useRouter()

  if (isNotNull(locale)) {
    const onChange = (event: MouseEvent, newLocale: Locale) => {
      if (newLocale !== null) {
        // void router.push({ pathname, query }, asPath, { locale: newLocale })
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
