import React from 'react'
import PropTypes from 'prop-types'
import MathJax from '@innodoc/react-mathjax-node'

const Math = ({ data }) => {
  const [{ t: mathType }, texCode] = data
  const MathJaxComponent =
    mathType === 'InlineMath' ? MathJax.Span : MathJax.Div
  return <MathJaxComponent texCode={texCode} />
}

Math.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default Math
