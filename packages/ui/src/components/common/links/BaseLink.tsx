import { Link } from '@mui/material'
import { forwardRef } from 'react'

import type { LinkProps } from './types'

/** Link that handles `hash` */
const BaseLink = forwardRef<HTMLAnchorElement, BaseLinkProps>(function BaseLink(
  { children, hash, to = '', ...other },
  ref
) {
  return (
    <Link href={hash ? `${to}#${hash}` : to} keep-scroll-position="true" ref={ref} {...other}>
      {children}
    </Link>
  )
})

interface BaseLinkProps extends Omit<LinkProps, 'to'> {
  /** Optional hash */
  hash?: string

  /** Target (`href` or link specifier) */
  to?: string
}

export default BaseLink
