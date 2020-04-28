import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Typography } from 'antd'

import ContentFragment from '..'

const Header = ({ data }) => {
  const [level, [id, classes], content] = data
  return (
    <Typography.Title id={id} className={classNames(classes)} level={level}>
      <ContentFragment content={content} />
    </Typography.Title>
  )
}

Header.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default Header
