import { Link as MuiLink } from '@mui/material'
import { forwardRef } from 'react'

import type { LinkProps } from './types'

/**
 * Link to internal page
 *
 * Either built-in page or custom content page/section.
 */
const InternalLink = forwardRef<HTMLAnchorElement, LinkProps>(function InternalLink(
  { children, hash, to, ...other },
  ref
) {
  const href = hash ? `${to}#${hash}` : to

  return (
    <MuiLink {...other} href={href} ref={ref}>
      {children}
    </MuiLink>
  )
})

export default InternalLink
