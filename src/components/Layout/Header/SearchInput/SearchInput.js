import React from 'react'
import { useTranslation } from 'react-i18next'
import Input from 'antd/lib/input'

const SearchInput = (props) => {
  const { t } = useTranslation()
  return <Input.Search placeholder={t('header.searchPlaceholder')} {...props} />
}

export default SearchInput
