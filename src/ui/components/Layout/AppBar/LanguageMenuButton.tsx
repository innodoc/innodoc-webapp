import { useTranslation } from 'react-i18next'

import MenuButton from './common/MenuButton'
import MenuItemsLanguages from './MenuItemsLanguages'

function LanguageMenuButton() {
  const { t } = useTranslation()

  return (
    <MenuButton iconName="mdi:translate" id="appbar-language-menu" title={t('nav.language')}>
      <MenuItemsLanguages />
    </MenuButton>
  )
}

export default LanguageMenuButton
