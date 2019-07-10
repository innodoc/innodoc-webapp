import React from 'react'
import PropTypes from 'prop-types'

import fadeInCss from '../../../../../style/fadeIn.sass'
import useMathJax, { typesetStates } from '../../../../hooks/useMathJax'

const MathJaxDiv = ({ texCode }) => {
  const { mathJaxElem, typesetState } = useMathJax(texCode)
  const className = typesetState === typesetStates.SUCCESS
    ? fadeInCss.show
    : fadeInCss.hide
  return <div className={className} ref={mathJaxElem} />
}

MathJaxDiv.propTypes = { texCode: PropTypes.string }
MathJaxDiv.defaultProps = { texCode: '' }

export default MathJaxDiv
