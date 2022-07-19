import { Input } from 'antd'

import { useTranslation } from 'next-i18next'

const SearchInput = () => {
  const { t } = useTranslation()
  return <Input.Search placeholder={t('header.searchPlaceholder')} />
}

export default SearchInput
