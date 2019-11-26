import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import useMathJax from '../../../../hooks/mathjax/useMathJax'

const Math = ({ data }) => {
  const [{ t: mathType }, texCode] = data
  const cls = mathType === 'InlineMath' ? 'inline' : 'display'
  const { mathJaxElem } = useMathJax(texCode, cls)
  return <span className={classNames('math', cls)} ref={mathJaxElem} />
}

Math.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default Math
