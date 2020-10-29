import React from 'react'
import PropTypes from 'prop-types'
import { Tag } from 'antd'
import { AuditOutlined, FormOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/common/src/i18n'

const SectionTypeTag = ({ className, type }) => {
  const { t } = useTranslation()

  if (!type) {
    return null
  }

  const color = type === 'exercises' ? 'green' : 'blue'
  const icon = type === 'exercises' ? <FormOutlined /> : <AuditOutlined />
  return (
    <Tag className={className} color={color} icon={icon}>
      {t(`common.sectionTypes.${type}`)}
    </Tag>
  )
}

SectionTypeTag.defaultProps = {
  className: null,
  type: null,
}

SectionTypeTag.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(['exercises', 'test']),
}

export default SectionTypeTag
