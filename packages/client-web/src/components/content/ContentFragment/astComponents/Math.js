import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import useMathJax, { mathDelimiter } from '../../../../hooks/useMathJax'

const Math = ({ data }) => {
  const [{ t: mathType }, texCode] = data
  const cls = mathType === 'InlineMath' ? 'inline' : 'display'
  const { mathJaxElem } = useMathJax(texCode, cls)
  // const delims = mathDelimiter[cls]
  return <span className={classNames('math', cls)} ref={mathJaxElem} />

  // return (
  //   <span className={classNames('math', cls)} ref={mathJaxElem}>
  //     {delims[0]}
  //     {texCode}
  //     {delims[1]}
  //   </span>
  // )
}

Math.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default Math
