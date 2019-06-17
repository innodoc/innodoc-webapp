import React from 'react'
import Input from 'antd/lib/input'

import { useTranslation } from '../../../../lib/i18n'

const SearchInput = (props) => {
  const { t } = useTranslation()
  return <Input.Search placeholder={t('header.searchPlaceholder')} {...props} />
}

export default SearchInput
