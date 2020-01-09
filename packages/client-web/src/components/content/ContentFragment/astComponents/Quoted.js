import React from 'react'
import PropTypes from 'prop-types'

import ContentFragment from '..'

const Quoted = ({ data: [, content] }) => (
  <>
    &ldquo;
    <ContentFragment content={content} />
    &rdquo;
  </>
)

Quoted.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  ).isRequired,
}

export default Quoted
