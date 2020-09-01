import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'

import { useTranslation } from '@innodoc/common/src/i18n'

const SearchInput = ({ classNames }) => {
  const { t } = useTranslation()
  return <Input.Search className={classNames} placeholder={t('header.searchPlaceholder')} />
}

SearchInput.defaultProps = { classNames: '' }
SearchInput.propTypes = { classNames: PropTypes.string }

export default SearchInput
