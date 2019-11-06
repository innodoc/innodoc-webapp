import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { mathDelimiter } from '../../../../hooks/useMathJax'

const Math = ({ data }) => {
  const [{ t: mathType }, texCode] = data
  const cls = mathType === 'InlineMath' ? 'inline' : 'display'
  const delims = mathDelimiter[cls]
  return (
    <span className={classNames('math', cls)}>
      {delims[0]}
      {texCode}
      {delims[1]}
    </span>
  )
}

Math.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default Math
