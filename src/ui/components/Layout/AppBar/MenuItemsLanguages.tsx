import { ListItemText, MenuItem } from '@mui/material'
import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { selectLocales } from '@/store/selectors/content/course'
import { selectLocale } from '@/store/selectors/ui'
import { changeLocale } from '@/store/slices/uiSlice'
import { useDispatch, useSelector } from '@/ui/hooks/store'

function MenuItemsLanguages({ inset }: MenuItemsLanguagesProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const locales = useSelector(selectLocales)
  const currentLocale = useSelector(selectLocale)

  return (
    <>
      {locales.map((locale) => (
        <MenuItem
          key={locale}
          onClick={() => dispatch(changeLocale(locale))}
          selected={locale === currentLocale}
        >
          <ListItemText inset={inset}>{t(`languages.${locale}`)}</ListItemText>
        </MenuItem>
      ))}
    </>
  )
}

type MenuItemsLanguagesProps = Pick<ComponentProps<typeof ListItemText>, 'inset'>

export default MenuItemsLanguages
