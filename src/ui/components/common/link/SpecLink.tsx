import { forwardRef } from 'react'
import { Trans } from 'react-i18next'

import type { RouteInfo } from '#types/common'
import Code from '#ui/components/common/Code'
import InlineError from '#ui/components/common/error/InlineError'
import type { LinkProps } from '#ui/components/common/link/types'
import useRouteManager from '#ui/hooks/useRouteManager'

import AppLink from './AppLink'

/** Link from specifier */
const SpecLink = forwardRef<HTMLAnchorElement, LinkProps>(function ContentLink(
  { to, ...other },
  ref
) {
  const { parseLinkSpecifier } = useRouteManager()
  let routeInfo: Partial<RouteInfo>

  try {
    routeInfo = parseLinkSpecifier(to)
  } catch {
    return (
      <InlineError>
        <Trans
          i18nKey="error.specLinkToProp"
          components={{ 0: <Code />, 2: <Code /> }}
          values={{ to }}
        >
          {`<0>Link</0>: <2>{{to}}</2> is invalid`}
        </Trans>
      </InlineError>
    )
  }

  return <AppLink routeInfo={routeInfo} ref={ref} {...other} />
})

export default SpecLink
