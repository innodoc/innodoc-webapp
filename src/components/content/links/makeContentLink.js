import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Link from 'next/link'

import { childrenType } from '../../../lib/propTypes'

const makeContentLink = (makeGetContentLink, pathnamePrefix) => {
  const ContentLink = ({ children, contentId: contentIdHash }) => {
    const getContentLink = useMemo(makeGetContentLink, [])
    const { contentId, hash, title } = useSelector(
      (state) => getContentLink(state, contentIdHash)
    )

    const href = {
      pathname: `/${pathnamePrefix}`,
      query: { contentId },
    }
    const as = { pathname: `/${pathnamePrefix}/${contentId}` }
    if (hash) {
      as.hash = `#${hash}`
    }

    const newChildren = children
      ? React.cloneElement(children, { title })
      : <a>{title}</a>

    return (
      <Link href={href} as={as}>
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
