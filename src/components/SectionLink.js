import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import { childrenType } from '../lib/propTypes'

const SectionLink = ({ sectionPath, children }) => {
  const href = { pathname: '/page', query: { sectionPath } }
  const as = `/page/${sectionPath}`
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
