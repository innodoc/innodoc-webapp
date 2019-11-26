import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { childrenType } from '@innodoc/client-misc/src/propTypes'

import MathJaxContext from './MathJaxContext'
import typesetStates from '../hooks/mathjax/states'

import useInitMathJax from '../hooks/mathjax/useInitMathJax'

const MathJaxProvider = ({ children, options }) => {
  console.log('provider render')
  const typesetTimer = useRef(false)
  const [typesetStatus, setTypesetStatus] = useState(typesetStates.INITIAL)
  useInitMathJax(options)
  return (
    <MathJaxContext.Provider value={{ setTypesetStatus, typesetStatus, typesetTimer }}>
      {children}
    </MathJaxContext.Provider>
  )
}

MathJaxProvider.propTypes = {
  children: childrenType.isRequired,
  options: PropTypes.object.isRequired,
}

export default MathJaxProvider
