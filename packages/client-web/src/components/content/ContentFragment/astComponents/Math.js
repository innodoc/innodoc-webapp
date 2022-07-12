import React from 'react'
import PropTypes from 'prop-types'
import MathJax from '@innodoc/react-mathjax-node'

import css from './ast.module.sss'

const Math = ({ data }) => {
  const [{ t: mathType }, texCode] = data
  const isInline = mathType === 'InlineMath'

  const mathNode = (
    <MathJax.MathJaxNode displayType={isInline ? 'inline' : 'display'} texCode={texCode} />
  )

  return isInline ? mathNode : <div className={css.displayMathWrapper}>{mathNode}</div>
}

Math.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default Math
