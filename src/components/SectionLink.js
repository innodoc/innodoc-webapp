import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import { childrenType } from '../lib/propTypes'

const SectionLink = ({ sectionId, children }) => {
  const href = { pathname: '/page', query: { sectionId } }
  const as = `/page/${sectionId}`
  return (
    <Link href={href} as={as}>
      {children}
    </Link>
  )
}
SectionLink.propTypes = {
  sectionId: PropTypes.string.isRequired,
  children: childrenType.isRequired,
}

export default SectionLink
