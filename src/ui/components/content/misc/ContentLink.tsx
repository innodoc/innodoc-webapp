import { styled } from '@mui/material'
import { Children, forwardRef } from 'react'

import Icon from '#ui/components/common/Icon'
import BaseLink from '#ui/components/common/link/BaseLink'
import SpecLink from '#ui/components/common/link/SpecLink'
import type { LinkProps } from '#ui/components/common/link/types'

const StyledIcon = styled(Icon)({ fontSize: '1em' })

/**
 * Content link
 *
 * Supports all types of links, e.g. internal link specifier and external URL.
 */
const ContentLink = forwardRef<HTMLAnchorElement, LinkProps>(function ContentLink(
  { children, hash, to, ...other },
  ref
) {
  // Link to anchor on same page
  if (to === '' && hash) {
    return (
      <BaseLink hash={hash} to={to} ref={ref}>
        {children}
      </BaseLink>
    )
  }

  // App route
  if (to.startsWith('app://')) {
    const linkSpecifier = `app:${decodeURIComponent(to.slice(6))}`
    let specChildren = children
    const childrenArr = Children.toArray(children)

    // <app:...> style links: They have the URL itself as content. We remove
    // the content, so it gets replaced with the title.
    if (childrenArr.length === 1 && childrenArr[0] === linkSpecifier) {
      specChildren = null
    }

    return (
      <SpecLink hash={hash} to={linkSpecifier} ref={ref} {...other}>
        {specChildren}
      </SpecLink>
    )
  }

  // External link
  return (
    <BaseLink hash={hash} to={to} ref={ref} {...other}>
      {children}
      <StyledIcon name="mdi:open-in-new" />
    </BaseLink>
  )
})

export default ContentLink
