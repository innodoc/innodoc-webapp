import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Link from 'next/link'

import { childrenType } from '../../../lib/propTypes'

const makeContentLink = (makeGetContentLink, pathnamePrefix) => {
  const ContentLink = ({ children, contentId: contentIdHash }) => {
    const getContentLink = useMemo(makeGetContentLink, [])
    const { contentId, hash, title } = useSelector(
      state => getContentLink(state, contentIdHash)
    )
    const linkProps = {
      href: {
        pathname: `/${pathnamePrefix}`,
        query: { contentId },
      },
      as: { pathname: `/${pathnamePrefix}/${contentId}` },
    }
    if (hash) {
      linkProps.as.hash = `#${hash}`
    }

    const newChildren = children
      ? React.cloneElement(children, { title })
      : <a>{title}</a>

    return (
      <Link {...linkProps}>
        {newChildren}
      </Link>
    )
  }

  ContentLink.defaultProps = {
    children: null,
  }

  ContentLink.propTypes = {
    children: childrenType,
    contentId: PropTypes.string.isRequired,
  }

  return ContentLink
}

export default makeContentLink
