import { Input } from 'antd'
import { useTranslation } from 'next-i18next'

function SearchInput() {
  const { t } = useTranslation()
  return <Input.Search placeholder={t('header.searchPlaceholder')} />
}

export default SearchInput
