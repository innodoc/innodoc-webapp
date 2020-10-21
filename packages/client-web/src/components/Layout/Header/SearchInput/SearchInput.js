import React from 'react'
import { Input } from 'antd'

import { useTranslation } from '@innodoc/common/src/i18n'

const SearchInput = () => {
  const { t } = useTranslation()
  return <Input.Search placeholder={t('header.searchPlaceholder')} />
}

export default SearchInput
