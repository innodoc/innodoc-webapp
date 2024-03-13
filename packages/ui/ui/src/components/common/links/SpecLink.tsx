import { forwardRef } from 'react'
import { Trans } from 'react-i18next'

import { InlineError } from '#components/common/errors'
import { Code } from '#components/common/misc'
import useRouteManager from '#hooks/routes'

import AppLink from './AppLink.js'
import type { LinkProps } from './types.js'

/** Link from specifier */
const SpecLink = forwardRef<HTMLAnchorElement, LinkProps>(function ContentLink({ to, ...other }, ref) {
  const { parseLinkSpecifier } = useRouteManager()
  let routeInfo: ReturnType<typeof parseLinkSpecifier>

  try {
    routeInfo = parseLinkSpecifier(to)
  } catch {
    return (
      <InlineError>
        <Trans i18nKey="error.specLinkToProp" components={{ 0: <Code />, 2: <Code /> }} values={{ to }}>
          {`<0>Link</0>: <2>{{to}}</2> is invalid`}
        </Trans>
      </InlineError>
    )
  }

  return <AppLink routeInfo={routeInfo} ref={ref} {...other} />
})

export default SpecLink
