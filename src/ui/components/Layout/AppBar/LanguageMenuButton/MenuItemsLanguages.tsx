import { ListItemText, MenuItem } from '@mui/material'
import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { selectRouteInfo } from '#store/slices/appSlice'
import AppLink from '#ui/components/common/link/AppLink'
import { useSelector } from '#ui/hooks/store/store'
import useSelectCurrentCourse from '#ui/hooks/store/useSelectCurrentCourse'

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
