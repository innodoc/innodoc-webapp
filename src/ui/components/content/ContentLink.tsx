import { styled } from '@mui/material'
import { forwardRef } from 'react'

import Icon from '#ui/components/common/Icon'
import BaseLink from '#ui/components/common/link/BaseLink'
import SpecLink from '#ui/components/common/link/SpecLink'
import type { LinkProps } from '#ui/components/common/link/types'

const StyledIcon = styled(Icon)({ fontSize: '1rem' })

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
    return (
      <SpecLink hash={hash} to={`app:${decodeURIComponent(to.slice(6))}`} ref={ref} {...other}>
        {children}
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
