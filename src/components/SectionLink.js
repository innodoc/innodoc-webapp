import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import { childrenType } from '../lib/propTypes'

const SectionLink = ({ sectionId: sectionIdHash, children }) => {
  const splitted = sectionIdHash.split('#')
  const [sectionId] = splitted

  const linkProps = {
    href: { pathname: '/page', query: { sectionId } },
    as: `/page/${sectionIdHash}`,
  }
  if (splitted.length === 2) {
    linkProps.href.query.hash = `#${splitted[1]}`
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
