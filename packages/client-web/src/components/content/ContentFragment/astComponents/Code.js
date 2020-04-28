import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Typography } from 'antd'

const Code = ({ data }) => {
  const [[id, classNames], content] = data
  return (
    <Typography.Text code id={id} className={classnames(classNames)}>
      {content}
    </Typography.Text>
  )
}

Code.propTypes = {
  data: PropTypes.node.isRequired,
}

export default Code
