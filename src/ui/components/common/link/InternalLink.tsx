import clsx from 'clsx'
import { forwardRef, type ReactNode } from 'react'

import { selectLocale, selectUrlWithoutLocale } from '@/store/selectors/ui'
import { useSelector } from '@/ui/hooks/store'

/**
 * Link to an internal page, either built-in page or custom content
 * page/section.
 */
const InternalLink = forwardRef<HTMLAnchorElement, InternalLinkProps>(function Link(
  { children, className, to, ...other },
  ref
) {
  const locale = useSelector(selectLocale)
  const urlWithoutLocale = useSelector(selectUrlWithoutLocale)

  return (
    <a
      {...other}
      className={clsx(className, urlWithoutLocale === to && 'active')}
      href={`/${locale}${to}`}
      ref={ref}
    >
      {children}
    </a>
  )
})

export type InternalLinkProps = {
  children: ReactNode
  className?: string
  /** Target path *without* locale. */
  to: string
}

export default InternalLink
