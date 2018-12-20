import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import { childrenType } from '../lib/propTypes'
import { parseSectionId } from '../lib/util'

const SectionLink = ({ sectionId: sectionIdHash, children }) => {
  const [sectionId, hash] = parseSectionId(sectionIdHash)
  const linkProps = {
    href: {
      pathname: '/page',
      query: { sectionId },
    },
    as: {
      pathname: `/page/${sectionId}`,
      hash: hash ? `#${hash}` : undefined,
    },
  }
  return (
    <Link {...linkProps}>
      {children}
    </Link>
  )
}

SectionLink.propTypes = {
  sectionId: PropTypes.string.isRequired,
  children: childrenType.isRequired,
}

export default SectionLink
