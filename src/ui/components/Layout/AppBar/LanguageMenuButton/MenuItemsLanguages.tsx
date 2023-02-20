import { ListItemText, MenuItem } from '@mui/material'
import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import useSelectCurrentCourse from '#store/hooks/useSelectCurrentCourse'
import { changeLocale, selectLocale } from '#store/slices/uiSlice'
import { useDispatch, useSelector } from '#ui/hooks/store'

function MenuItemsLanguages({ closeMenu = () => undefined, inset }: MenuItemsLanguagesProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { course } = useSelectCurrentCourse()
  const currentLocale = useSelector(selectLocale)

  if (course === undefined) {
    return null
  }

  return (
    <>
      {course.locales.map((locale) => {
        const handleClick = () => {
          dispatch(changeLocale(locale))
          closeMenu()
        }
        return (
          <MenuItem key={locale} onClick={handleClick} selected={locale === currentLocale}>
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
