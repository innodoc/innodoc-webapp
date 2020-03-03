import React from 'react'
import PropTypes from 'prop-types'
import { InfoCircleOutlined, CopyrightOutlined } from '@ant-design/icons'

const iconTypeComponentMap = {
  'info-circle': InfoCircleOutlined,
  copyright: CopyrightOutlined,
}

const PageIcon = ({ type }) => {
  const Component = iconTypeComponentMap[type]
  return Component ? <Component /> : null
}

PageIcon.propTypes = {
  type: PropTypes.string.isRequired,
}

export default PageIcon
