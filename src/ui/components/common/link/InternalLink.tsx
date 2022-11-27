import { Link as MuiLink } from '@mui/material'
import clsx from 'clsx'
import { type ComponentProps, forwardRef } from 'react'

import { selectLocale, selectUrlWithoutLocale } from '#store/slices/uiSlice'
import { useSelector } from '#ui/hooks/store'
import { formatUrl } from '#utils/url'

/**
 * Link to an internal page, either built-in page or custom content
 * page/section.
 */
const InternalLink = forwardRef<HTMLAnchorElement, InternalLinkProps>(function InternalLink(
  { children, className, hash, to, ...other },
  ref
) {
  const locale = useSelector(selectLocale)
  const urlWithoutLocale = useSelector(selectUrlWithoutLocale)
  const classNames = clsx(className, urlWithoutLocale === to && 'active')

  return (
    <MuiLink {...other} className={classNames} href={formatUrl(to, locale, hash)} ref={ref}>
      {children}
    </MuiLink>
  )
})

export type InternalLinkProps = Omit<ComponentProps<typeof MuiLink>, 'href'> & {
  /** Optional hash */
  hash?: string
  /** Target path *without* locale */
  to: string
}

export default InternalLink
