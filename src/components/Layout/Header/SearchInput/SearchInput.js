import React from 'react'
import PropTypes from 'prop-types'
import Input from 'antd/lib/input'

import { useTranslation } from '../../../../lib/i18n'

const SearchInput = ({ classNames }) => {
  const { t } = useTranslation()
  return (
    <Input.Search
      classNames={classNames}
      placeholder={t('header.searchPlaceholder')}
    />
  )
}

SearchInput.defaultProps = { classNames: '' }
SearchInput.propTypes = { classNames: PropTypes.string }

export default SearchInput
