import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Link from 'next/link'

import { propTypes } from '@innodoc/misc'
import appSelectors from '@innodoc/store/src/selectors'

import getLinkInfo from '../../../getLinkInfo'

const makeContentLink = (makeGetContentLink, prefixName) => {
  const ContentLink = ({ children, contentId: contentIdHash, preferShortTitle }) => {
    const getContentLink = useMemo(makeGetContentLink, [])
    const { contentId, hash, shortTitle, title } = useSelector((state) =>
      getContentLink(state, contentIdHash)
    )
    const pathPrefix = useSelector(appSelectors.getApp)[`${prefixName}PathPrefix`]
    const { href, as } = getLinkInfo(pathPrefix, contentId, hash)
    const titleStr = preferShortTitle && shortTitle ? shortTitle : title

    const newChildren = children ? (
      React.cloneElement(children, { title: titleStr })
    ) : (
      <a>{titleStr}</a>
    )

    return (
      <Link href={href} as={as}>
        {newChildren}
      </Link>
    )
  }

  ContentLink.defaultProps = {
    children: null,
    preferShortTitle: false,
  }

  ContentLink.propTypes = {
    children: propTypes.childrenType,
    contentId: PropTypes.string.isRequired,
    preferShortTitle: PropTypes.bool,
  }

  return ContentLink
}

export default makeContentLink
