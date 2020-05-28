import React from 'react'
import PropTypes from 'prop-types'

import MathJax from '@innodoc/react-mathjax-node'

const MathJaxPreview = ({ texCode }) =>
  texCode.length ? (
    <MathJax.Provider>
      <MathJax.MathJaxNode displayType="display" texCode={texCode} />
    </MathJax.Provider>
  ) : null

MathJaxPreview.propTypes = {
  texCode: PropTypes.string.isRequired,
}

export default MathJaxPreview
