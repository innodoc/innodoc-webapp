import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { mathDelimiter, useMathJaxRemoveOnUnmount } from '../../../../hooks/useMathJax'

const Math = ({ data }) => {
  const [{ t: mathType }, texCode] = data
  const [delims, classes] = mathType === 'InlineMath'
    ? [mathDelimiter.inline, ['math', 'inline']]
    : [mathDelimiter.display, ['math', 'display']]
  const mathJaxElem = useMathJaxRemoveOnUnmount()
  return (
    <span className={classNames(classes)} ref={mathJaxElem}>
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
