import React from 'react'
import PropTypes from 'prop-types'

import MathJaxNode from 'use-mathjax'

const Math = ({ data }) => {
  const [{ t: mathType }, texCode] = data
  return (
    <MathJaxNode
      displayType={mathType === 'InlineMath' ? 'inline' : 'display'}
      texCode={texCode}
    />
  )
}

Math.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default Math
