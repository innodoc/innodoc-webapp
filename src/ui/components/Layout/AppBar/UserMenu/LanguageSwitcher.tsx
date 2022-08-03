import { type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { navigate } from 'vite-plugin-ssr/client/router'

import { selectLocales } from '@/store/selectors/content'
import { selectLocale } from '@/store/selectors/ui'
import { Locale } from '@/types/common'
import MenuToggleButtonGroup from '@/ui/components/common/MenuToggleButtonGroup'
import { useSelector } from '@/ui/hooks/store'

function LanguageSwitcher() {
  const { t } = useTranslation()
  const locale = useSelector(selectLocale)
  const locales = useSelector(selectLocales)

  if (locale !== null) {
    const onChange = (event: MouseEvent, newLocale: Locale) => {
      if (newLocale !== null) {
        void navigate(`/de/page/about`, {
          keepScrollPosition: true,
          overwriteLastHistoryEntry: true,
        })
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
