import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { childrenType } from '@innodoc/client-misc/src/propTypes'

import MathJaxContext from './MathJaxContext'

import { useLoadMathJax } from '../hooks/useMathJax'

// All formulas under this context are connected.

const MathJaxProvider = ({ children, options }) => {
  const [numFormularsProcessing, setFormularsProcessing] = useState(0)
  const [typesettingDone, setTypesettingDone] = useState(false)
  const mathJaxReady = useLoadMathJax(options)
  useEffect(() => {
    if (mathJaxReady && numFormularsProcessing === 0) {
      setTypesettingDone(true)
    }
  }, [mathJaxReady, numFormularsProcessing])

  return (
    <MathJaxContext.Provider value={{ setFormularsProcessing }}>
      {children(typesettingDone)}
    </MathJaxContext.Provider>
  )
}

MathJaxProvider.propTypes = {
  children: childrenType.isRequired,
  options: PropTypes.object.isRequired,
}

export default MathJaxProvider
