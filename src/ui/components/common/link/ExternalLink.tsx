import { Link, styled } from '@mui/material'
import { type ComponentProps, forwardRef } from 'react'

import Icon from '#ui/components/common/Icon'

const StyledIcon = styled(Icon)({ fontSize: '1rem' })

/**
 * External link
 *
 * Adds an characteristic icon to external links.
 */
const ExternalLink = forwardRef<HTMLAnchorElement, ComponentProps<typeof Link>>(
  function ExternalLink({ children, ...other }, ref) {
    return (
      <Link ref={ref} {...other}>
        {children}
        <StyledIcon name="mdi:open-in-new" />
      </Link>
    )
  }
)

export default ExternalLink
