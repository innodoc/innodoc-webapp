import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { childrenType } from '@innodoc/client-misc/src/propTypes'

import MathJaxContext from './MathJaxContext'

// All formulas under this context are connected.

const MathJaxProvider = ({ children, options }) => {
  const [numFormulars, setNumFormulars] = useState(0)
  return (
    <MathJaxContext.Provider value={{ options, setNumFormulars }}>
      {children(numFormulars)}
    </MathJaxContext.Provider>
  )
}

MathJaxProvider.propTypes = {
  children: childrenType.isRequired,
  options: PropTypes.object.isRequired,
}

export default MathJaxProvider
