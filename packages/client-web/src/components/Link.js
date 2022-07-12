import React from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'

import { propTypes } from '@innodoc/client-misc'

const Link = ({ children, href }) => (
  <NextLink href={href}>
    <a>{children}</a>
  </NextLink>
)

Link.propTypes = {
  children: propTypes.childrenType.isRequired,
  href: PropTypes.string.isRequired,
}

export default Link
