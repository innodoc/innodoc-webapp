import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import { childrenType } from '../lib/propTypes'

const PageLink = ({ section, children }) => {
  const href = { pathname: '/page', query: { section } }
  const as = `/page/${section}`
  return (
    <Link href={href} as={as}>
      {children}
    </Link>
  )
}
PageLink.propTypes = {
  section: PropTypes.string.isRequired,
  children: childrenType.isRequired,
}

export default PageLink
