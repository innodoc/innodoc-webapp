import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'antd/lib/icon'

import ContentFragment from '..'
import { PageLink, SectionLink } from '../../links'
import Video from './Video'
import css from './style.sass'

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

  // Unhandled internal link
  if (!href.startsWith('/page/') && !href.startsWith('/section/')) {
    if (process.env.NODE_ENV !== 'production') {
      const msg = `Unhandled internal link: ${href}`
      return (
        <span>
          <span className={css.errorBGColor}>
            {msg}
          </span>
          <ContentFragment content={content} />
        </span>
      )
    }
    return contentAvailable
      ? <ContentFragment content={content} />
      : null
  }

  // Internal link
  const LinkComponent = href.startsWith('/page/') ? PageLink : SectionLink
  const contentId = href.startsWith('/page/') ? href.slice(6) : href.slice(9)
  return contentAvailable
    ? (
      <LinkComponent contentId={contentId}>
        <a>
          <ContentFragment content={content} />
        </a>
      </LinkComponent>
    )
    : <LinkComponent contentId={contentId} />
}

Link.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default Link
