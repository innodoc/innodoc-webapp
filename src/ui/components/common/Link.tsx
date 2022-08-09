import clsx from 'clsx'
import { forwardRef, type ReactNode } from 'react'

import { selectLocale, selectUrlWithoutLocale } from '@/store/selectors/ui'
import { Page } from '@/types/api'
import { useSelector } from '@/ui/hooks/store'
import { pageUrl } from '@/utils/url'

const LinkWithLocale = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, children, ...other },
  ref
) {
  return (
    <a {...other} href={to} ref={ref}>
      {children}
    </a>
  )
})

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { children, className, to, ...other },
  ref
) {
  const locale = useSelector(selectLocale)
  const urlWithoutLocale = useSelector(selectUrlWithoutLocale)

  if (locale === null) {
    return <>{children}</>
  }

  return (
    <LinkWithLocale
      className={clsx(className, urlWithoutLocale === to && 'active')}
      to={`/${locale}${to}`}
      ref={ref}
      {...other}
    >
      {children}
    </LinkWithLocale>
  )
})

type LinkProps = {
  children: ReactNode
  className?: string
  to: string
}

const PageLink = forwardRef<HTMLAnchorElement, PageLinkProps>(function PageLink(
  { pageId, ...other },
  ref
) {
  return <Link to={pageUrl(pageId)} ref={ref} {...other} />
})

type PageLinkProps = Omit<LinkProps, 'to'> & {
  pageId: Page['id']
}

export { LinkWithLocale, PageLink }
export default Link
