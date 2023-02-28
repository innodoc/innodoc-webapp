import { Link as MuiLink } from '@mui/material'
import clsx from 'clsx'
import { forwardRef } from 'react'

import { useSelector } from '#ui/hooks/store'

import type { LinkProps } from './types'

/**
 * Link to an internal page, either built-in page or custom content
 * page/section.
 */
const InternalLink = forwardRef<HTMLAnchorElement, LinkProps>(function InternalLink(
  { children, className, hash, to, ...other },
  ref
) {
  // TODO
  // const urlWithoutLocale = useSelector(selectUrlWithoutLocale)
  // const classNames = clsx(className, urlWithoutLocale === to && 'active')
  const classNames = ''
  const href = hash ? `${to}#${hash}` : to

  return (
    <MuiLink {...other} className={classNames} href={href} ref={ref}>
      {children}
    </MuiLink>
  )
})

export default InternalLink
