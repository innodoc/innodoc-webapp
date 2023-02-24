import { ListItemText, MenuItem } from '@mui/material'
import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import useGenerateUrl from '#routes/useGenerateUrl'
import useSelectCurrentCourse from '#store/hooks/useSelectCurrentCourse'
import { selectRouteInfo } from '#store/slices/appSlice'
import InternalLink from '#ui/components/common/link/InternalLink'
import { useSelector } from '#ui/hooks/store'

function MenuItemsLanguages({ closeMenu = () => undefined, inset }: MenuItemsLanguagesProps) {
  const generateUrl = useGenerateUrl()
  const { t } = useTranslation()

  const { course } = useSelectCurrentCourse()
  const { locale: currentLocale } = useSelector(selectRouteInfo)

  if (course === undefined) return null

  const handleClick = () => {
    closeMenu()
  }

  return (
    <>
      {course.locales.map((locale) => {
        return (
          <MenuItem
            component={InternalLink}
            keep-scroll-position="true"
            key={locale}
            onClick={handleClick}
            selected={locale === currentLocale}
            to={generateUrl({ locale })}
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
