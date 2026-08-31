import type { ComponentProps } from 'react'
import { ListItemText, MenuItem } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { isLocale } from '@innodoc/shared-core/typeguards'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import { LocaleLink } from '@innodoc/ui-design-system/links'
import { useSelectCurrentCourse, useSelector } from '@innodoc/ui-shared/store-hooks'

function MenuItemsLanguages({ closeMenu, inset }: MenuItemsLanguagesProps) {
  const { t } = useTranslation()

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

  return (
    <>
      {course.locales
        .filter((locale) => isLocale(locale))
        .map((locale) => {
          return (
            <MenuItem
              component={LocaleLink}
              key={locale}
              locale={locale}
              onClick={handleClick}
              selected={locale === currentLocale}
            >
              <ListItemText inset={inset}>{t(`languages.${locale}`)}</ListItemText>
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
