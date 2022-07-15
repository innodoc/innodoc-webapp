import React from 'react'
import PropTypes from 'prop-types'
import Icon from '@ant-design/icons'
import ExternalLinkSvg from '@fortawesome/fontawesome-free/svgs/solid/external-link-alt.svg'

import ContentFragment from '..'
import { ContentLink } from '../../links'
import Video from './Video'

const Link = ({ data }) => {
  const [[, classes], content, [href, title]] = data

  if (classes.includes('video')) {
    return <Video data={data} />
  }

  // mailto link
  if (href.startsWith('mailto:')) {
    return (
      <a href={href} title={title}>
        <ContentFragment content={content} />
      </a>
    )
  }

  // External link
  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} title={title}>
        <ContentFragment content={content} />{' '}
        <sup>
          <Icon component={ExternalLinkSvg} />
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
  return content && content.length ? (
    <ContentLink href={href}>
      <a>
        <ContentFragment content={content} />
      </a>
    </ContentLink>
  ) : (
    <ContentLink href={href} />
  )
}

Link.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default Link
