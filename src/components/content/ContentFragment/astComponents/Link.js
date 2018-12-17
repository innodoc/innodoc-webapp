import React from 'react'
import PropTypes from 'prop-types'

import ContentFragment from '..'
import Video from './Video'

const ExternalLink = ({ data }) => {
  const [[, classes], content, [href, title]] = data

  return classes.includes('video')
    ? (<Video data={data} />)
    : (
      <a href={href} title={title}>
        <ContentFragment content={content} />
      </a>
    )
}

ExternalLink.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default ExternalLink
