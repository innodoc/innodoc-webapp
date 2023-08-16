import { useTranslation } from 'react-i18next'

import { MenuButton } from '#components/common/buttons'

import MenuItemsLanguages from './MenuItemsLanguages'

function LanguageMenuButton() {
  const { t } = useTranslation()

  return (
    <MenuButton iconName="mdi:translate" id="appbar-language-menu" title={t('nav.language')}>
      {(closeMenu) => <MenuItemsLanguages closeMenu={closeMenu} />}
    </MenuButton>
  )
}

export default LanguageMenuButton
