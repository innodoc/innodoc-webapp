import Link from 'next/link'
import PropTypes from 'prop-types'
import { cloneElement, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { childrenType } from '@innodoc/misc/propTypes'
import { getLinkInfo } from '@innodoc/misc/utils'
import { getApp } from '@innodoc/store/selectors/misc'

const makeContentLink = (makeGetContentLink, prefixName) => {
  function ContentLink({ children, contentId: contentIdHash, preferShortTitle }) {
    const getContentLink = useMemo(makeGetContentLink, [])
    const { contentId, hash, shortTitle, title } = useSelector((state) =>
      getContentLink(state, contentIdHash)
    )
    const pathPrefix = useSelector(getApp)[`${prefixName}PathPrefix`]
    const { href, as } = getLinkInfo(pathPrefix, contentId, hash)
    const titleStr = preferShortTitle && shortTitle ? shortTitle : title

    const newChildren = children ? cloneElement(children, { title: titleStr }) : <a>{titleStr}</a>

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
    children: childrenType,
    contentId: PropTypes.string.isRequired,
    preferShortTitle: PropTypes.bool,
  }

  return ContentLink
}

export default makeContentLink
