import { Link as MuiLink } from '@mui/material'

import BuiltinPageLink from './BuiltinPageLink'
import ContentLink from './ContentLink'
import { isBuiltinPageLinkProps, type LinkProps } from './types'

/** General link (supports all types of links) */
function Link(props: LinkProps) {
  const { to, ...other } = props

  // Content link
  if (to.startsWith('/section/') || to.startsWith('/page/')) {
    return <ContentLink {...props} />
  }

  // Built-in page
  if (isBuiltinPageLinkProps(props)) {
    return <BuiltinPageLink {...props} />
  }

  // External link
  return <MuiLink href={to} {...other} />
}

export default Link
