import { styled } from '@mui/material'
import { forwardRef } from 'react'

import { Icon } from '#misc'

import BaseLink from './BaseLink.js'
import SpecLink from './SpecLink.js'
import type { LinkProps } from './types.js'

const StyledIcon = styled(Icon)({ fontSize: '1em' })

/**
 * Content link
 *
 * Supports all types of links, e.g. internal link specifier and external URL.
 */
const ContentLink = forwardRef<HTMLAnchorElement, LinkProps>(function ContentLink(
  { children, hash, to, ...other },
  ref,
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

    // <app:...> style links: They have the URL itself as content. We remove
    // the content, so it gets replaced with the title.
    if (Array.isArray(children) && children.length === 1 && children[0] === linkSpecifier) {
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
