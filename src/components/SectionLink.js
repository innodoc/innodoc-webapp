import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import { childrenType } from '../lib/propTypes'
import { getSectionHref } from '../lib/util'

const SectionLink = ({ sectionPath, children }) => {
  const { href, as } = getSectionHref(sectionPath)
  return (
    <Link href={href} as={as}>
      {children}
    </Link>
  )
}
SectionLink.propTypes = {
  sectionPath: PropTypes.string.isRequired,
  children: childrenType.isRequired,
}

export default SectionLink
