import type { LinkProps } from './types.js'
import { Link } from '@mui/material'

/** Link that handles `hash` */
function BaseLink({ ref, children, hash, to = '', ...other }: BaseLinkProps) {
  return (
    <Link href={hash ? `${to}#${hash}` : to} keep-scroll-position="true" ref={ref} {...other}>
      {children}
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
