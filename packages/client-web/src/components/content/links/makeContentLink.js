import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Link from 'next/link'

import { childrenType } from '@innodoc/client-misc/src/propTypes'
import appSelectors from '@innodoc/client-store/src/selectors'

const makeContentLink = (makeGetContentLink, prefixName) => {
  const ContentLink = ({ children, contentId: contentIdHash }) => {
    const getContentLink = useMemo(makeGetContentLink, [])
    const { contentId, hash, title } = useSelector(
      (state) => getContentLink(state, contentIdHash)
    )
    const pathPrefix = useSelector(appSelectors.getApp)[`${prefixName}PathPrefix`]

    const href = {
      pathname: `/${pathPrefix}`,
      query: { contentId },
    }
    const as = { pathname: `/${pathPrefix}/${contentId}` }
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
