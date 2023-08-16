import { ListItemText, MenuItem } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { ComponentProps } from 'react'

import { selectRouteInfo } from '@innodoc/store/slices/app'

import { AppLink } from '#components/common'
import { useSelectCurrentCourse, useSelector } from '#hooks/store'

function MenuItemsLanguages({ closeMenu = () => undefined, inset }: MenuItemsLanguagesProps) {
  const { t } = useTranslation()

  const { course } = useSelectCurrentCourse()
  const { locale: currentLocale } = useSelector(selectRouteInfo)

  if (course === undefined) {
    return null
  }

  const handleClick = () => {
    closeMenu()
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
