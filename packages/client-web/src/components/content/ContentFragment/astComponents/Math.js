import React from 'react'
import PropTypes from 'prop-types'

import MathJaxNode from '../../../../mathjax/MathJaxNode'

const Math = ({ data }) => {
  const [{ t: mathType }, texCode] = data
  console.log(texCode)
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
