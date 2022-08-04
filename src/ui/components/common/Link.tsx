import clsx from 'clsx'
import { forwardRef, type ReactNode } from 'react'

import { selectLocale, selectUrlWithoutLocale } from '@/store/selectors/ui'
import { Page } from '@/types/api'
import { useSelector } from '@/ui/hooks/store'

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, children, ...other },
  ref
) {
  return (
    <a href={href} ref={ref} {...other}>
      {children}
    </a>
  )
})

type LinkProps = {
  children: ReactNode
  className?: string
  href: string
}

const LinkWithLocale = forwardRef<HTMLAnchorElement, LinkProps>(function LinkWithLocale(
  { children, className, href, ...other },
  ref
) {
  const locale = useSelector(selectLocale)
  const urlWithoutLocale = useSelector(selectUrlWithoutLocale)

  if (locale === null) {
    return <>children</>
  }

  return (
    <Link
      className={clsx(className, urlWithoutLocale === href && 'active')}
      href={`/${locale}${href}`}
      ref={ref}
      {...other}
    >
      {children}
    </Link>
  )
})

const PageLink = forwardRef<HTMLAnchorElement, PageLinkProps>(function PageLink(
  { pageId, children, ...other },
  ref
) {
  return (
    <LinkWithLocale
      href={`/${import.meta.env.INNODOC_PAGE_PATH_PREFIX}/${pageId}`}
      ref={ref}
      {...other}
    >
      {children}
    </LinkWithLocale>
  )
})

type PageLinkProps = {
  children: ReactNode
  pageId: Page['id']
}

export { PageLink }
export default Link
