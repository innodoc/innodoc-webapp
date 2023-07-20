import { forwardRef } from 'react'
import { Trans } from 'react-i18next'

import type { RouteInfo } from '@innodoc/routes/types'

import { Code, InlineError } from '#components/common'
import type { LinkProps } from '#components/common'
import useRouteManager from '#hooks/routes'

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
