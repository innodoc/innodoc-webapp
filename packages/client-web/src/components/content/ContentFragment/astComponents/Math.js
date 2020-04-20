import React from 'react'
import PropTypes from 'prop-types'
import MathJax from '@innodoc/react-mathjax-node'

const Math = ({ data }) => {
  const [{ t: mathType }, texCode] = data
  return (
    <MathJax.MathJaxNode
      displayType={mathType === 'InlineMath' ? 'inline' : 'display'}
      texCode={texCode}
    />
  )
}

Math.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default Math
