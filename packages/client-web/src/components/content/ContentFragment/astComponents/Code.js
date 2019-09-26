import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import css from './style.sss'

const Code = ({ data }) => {
  const [[id, classNames], content] = data
  return (
    <code id={id} className={classnames(css.code, classNames)}>
      {content}
    </code>
  )
}

Code.propTypes = {
  data: PropTypes.node.isRequired,
}

export default Code
