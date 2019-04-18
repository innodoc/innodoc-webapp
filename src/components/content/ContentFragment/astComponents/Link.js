import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'antd/lib/icon'

import ContentFragment from '..'
import SectionLink from '../../../SectionLink'
import Video from './Video'

const Link = ({ data }) => {
  const [[, classes], content, [href, title]] = data

  if (classes.includes('video')) {
    return <Video data={data} />
  }

  // External link
  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} title={title}>
        <ContentFragment content={content} />
        <sup><Icon type="link" /></sup>
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

  const children = content ? <ContentFragment content={content} /> : null
  return (
    <SectionLink sectionId={href}>
      <a>{children}</a>
    </SectionLink>
  )
}

Link.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default Link
