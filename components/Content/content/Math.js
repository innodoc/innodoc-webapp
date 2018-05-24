import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Math = ({ data }) => {
  const [{ t: mathType }, texCode] = data
  const [delims, classes] = mathType === 'InlineMath'
    ? [['\\(', '\\)'], ['math', 'inline']]
    : [['\\[', '\\]'], ['math', 'display']]

  return (
    <span className={classNames(classes)}>
      {delims[0]}{texCode}{delims[1]}
    </span>
  )
}

Math.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default Math
