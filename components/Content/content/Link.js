import React from 'react'
import PropTypes from 'prop-types'

import ContentFragment from '../ContentFragment'

const ExternalLink = ({ data }) => {
  const [, content, [href, title]] = data
  return (
    <a href={href} title={title}>
      <ContentFragment content={content} />
    </a>
  )
}

ExternalLink.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default ExternalLink
