import NextLink from 'next/link'
import PropTypes from 'prop-types'

import { childrenType } from '@innodoc/misc/propTypes'

function Link({ children, href }) {
  return (
    <NextLink href={href}>
      <a>{children}</a>
    </NextLink>
  )
}

Link.propTypes = {
  children: childrenType.isRequired,
  href: PropTypes.string.isRequired,
}

export default Link
