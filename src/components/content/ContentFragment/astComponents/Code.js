import React from 'react'
import PropTypes from 'prop-types'

const Code = ({ data }) => {
  const [[id, classNames], content] = data
  return (
    <code id={id} className={classNames}>
      {content}
    </code>
  )
}

Code.propTypes = {
  data: PropTypes.node.isRequired,
}

export default Code
