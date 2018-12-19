import React from 'react'
import PropTypes from 'prop-types'

import ContentFragment from '..'

const Quoted = ({ data: [, content] }) => (
  <React.Fragment>
    &ldquo;
    <ContentFragment content={content} />
    &rdquo;
  </React.Fragment>
)

Quoted.propTypes = {
  data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])).isRequired,
}

export default Quoted
