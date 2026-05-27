import type { LinkProps } from './types.js'
import { Link as MuiLink } from '@mui/material'
import { Link } from 'wouter'

/** Link that handles `hash` and client-side navigation via wouter */
function BaseLink({ ref, children, hash, to = '', ...other }: BaseLinkProps) {
  const href = hash ? `${to}#${hash}` : to

  return (
    <Link href={href} asChild>
      <MuiLink ref={ref} keep-scroll-position="true" {...other}>
        {children}
      </MuiLink>
    </Link>
  )
}

interface BaseLinkProps extends Omit<LinkProps, 'to'> {
  /** Optional hash */
  hash?: string

  /** Target (`href` or link specifier) */
  to?: string
}

export default BaseLink
