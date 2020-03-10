import React from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'

import { childrenType } from '@innodoc/client-misc/src/propTypes'

const Link = ({ children, href }) => (
  <NextLink href={href}>
    <a>{children}</a>
  </NextLink>
)

Link.propTypes = {
  children: childrenType.isRequired,
  href: PropTypes.string.isRequired,
}

export default Link
