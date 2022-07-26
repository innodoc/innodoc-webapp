import Link from 'next/link'
import PropTypes from 'prop-types'
import { cloneElement } from 'react'
// import { useSelector } from 'react-redux'

import { childrenType } from '@innodoc/misc/propTypes'
import { getLinkInfo } from '@innodoc/misc/utils'

// const makeContentLink = (makeGetContentLink, prefixName) => {
const makeContentLink = (prefixName) => {
  function ContentLink({ children, contentId: contentIdHash, preferShortTitle }) {
    // const getContentLink = useMemo(makeGetContentLink, [])
    // const { contentId, hash, shortTitle, title } = useSelector((state) =>
    //   getContentLink(state, contentIdHash)
    // )

    const contentId = 'testContentId'
    const hash = 'testHash'
    const shortTitle = 'testShortTitle'
    const title = 'testTitle'

    const pathPrefix =
      prefixName === 'page'
        ? process.env.NEXT_PUBLIC_PAGE_PATH_PREFIX
        : process.env.NEXT_PUBLIC_SECTION_PATH_PREFIX

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
