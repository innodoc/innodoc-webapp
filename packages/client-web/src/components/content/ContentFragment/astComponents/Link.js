import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'

import ContentFragment from '..'
import { InternalLink } from '../../links'
import Video from './Video'

const Link = ({ data }) => {
  const [[, classes], content, [href, title]] = data
  const contentAvailable = content && content.length

  if (classes.includes('video')) {
    return <Video data={data} />
  }

  // External link
  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} title={title}>
        <ContentFragment content={content} />
        <sup>
          <Icon type="link" />
        </sup>
      </a>
    )
  }

  // Hash reference on same page
  if (href.startsWith('#')) {
    return (
      <a href={href} title={title}>
        <ContentFragment content={content} />
      </a>
    )
  }

  // Internal link
  return contentAvailable ? (
    <InternalLink href={href}>
      <a>
        <ContentFragment content={content} />
      </a>
    </InternalLink>
  ) : (
    <InternalLink href={href} />
  )
}

Link.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default Link
