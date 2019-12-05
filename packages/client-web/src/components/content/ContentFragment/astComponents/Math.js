import React from 'react'
import PropTypes from 'prop-types'

import { MathJaxDiv, MathJaxSpan } from '@innodoc/use-mathjax'

const Math = ({ data }) => {
  const [{ t: mathType }, texCode] = data
  const MathJaxComponent = mathType === 'InlineMath' ? MathJaxSpan : MathJaxDiv
  return <MathJaxComponent texCode={texCode} />
}

Math.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default Math
