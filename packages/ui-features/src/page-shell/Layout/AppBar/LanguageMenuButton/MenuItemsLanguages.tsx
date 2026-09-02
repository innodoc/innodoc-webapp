import type { ComponentProps } from 'react'
import { ListItemText, MenuItem } from '@mui/material'
import ISO6391 from 'iso-639-1'
import { useTranslation } from 'react-i18next'
import { isLocale } from '@innodoc/shared-core/typeguards'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import { LocaleLink } from '@innodoc/ui-design-system/links'
import { useSelectCurrentCourse, useSelector } from '@innodoc/ui-shared/store-hooks'

const LANGUAGE_KEY_PREFIX = 'languages.'

function MenuItemsLanguages({ closeMenu, inset }: MenuItemsLanguagesProps) {
  const { t, i18n } = useTranslation()

  const { course } = useSelectCurrentCourse()
  const { locale: currentLocale } = useSelector(selectRouteInfo)

  if (course === undefined) {
    return null
  }

  const handleClick = () => {
    if (closeMenu) {
      closeMenu()
    }
  }

  const locales = course.locales.filter((locale) => isLocale(locale))

  // `course.locales` (DB) and the UI bundles on disk are two sets by design, so a course locale
  // can lack a `languages.*` key; its label then falls back to the ISO 639-1 name. Warn in
  // development so content authors discover the gap, and stay silent in production builds.
  if (import.meta.env.DEV) {
    for (const locale of locales) {
      const key = `${LANGUAGE_KEY_PREFIX}${locale}`
      if (!i18n.exists(key)) {
        console.warn(
          `Course locale "${locale}" has no "${key}" key in the active UI bundle; ` +
            `the language menu falls back to the ISO 639-1 name`,
        )
      }
    }
  }

  return (
    <>
      {locales.map((locale) => {
        return (
          <MenuItem
            component={LocaleLink}
            key={locale}
            locale={locale}
            onClick={handleClick}
            selected={locale === currentLocale}
          >
            <ListItemText inset={inset}>
              {t(`${LANGUAGE_KEY_PREFIX}${locale}`, { defaultValue: ISO6391.getName(locale) })}
            </ListItemText>
          </MenuItem>
        )
      })}
    </>
  )
}

interface MenuItemsLanguagesProps extends Pick<ComponentProps<typeof ListItemText>, 'inset'> {
  closeMenu?: () => void
}

export default MenuItemsLanguages
