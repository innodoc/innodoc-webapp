import { ListItemText, MenuItem } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { ComponentProps } from 'react'

import { AppLink } from '@innodoc/ui-design-system/links'
import { useSelectCurrentCourse, useSelector } from '@innodoc/ui-shared/hooks'
import { selectRouteInfo } from '@innodoc/ui-store/slices/app'

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
      {course.locales.map((locale) => {
        return (
          <MenuItem
            component={AppLink}
            keep-scroll-position="true"
            key={locale}
            onClick={handleClick}
            routeInfo={{ locale }}
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
