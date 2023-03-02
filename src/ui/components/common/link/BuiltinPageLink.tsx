import { Children, forwardRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import type { BuiltinPageRouteName } from '#routes/routes'
import builtInPages from '#ui/components/common/builtInPages'
import InlineError from '#ui/components/common/error/InlineError'

import InternalLink from './InternalLink'
import type { LinkProps } from './types'

/** Built-in page link */
const BuiltinPageLink = forwardRef<HTMLAnchorElement, BuiltinPageLinkProps>(
  function BuiltinPageLink({ children, to, ...other }, ref) {
    const { t } = useTranslation()
    const page = builtInPages.find((page) => page.routeName === to)

    if (!page) {
      return (
        <InlineError>
          <Trans
            i18nKey="error.unknownBuiltinPage"
            components={{ 0: <code />, 2: <code /> }}
            values={{ to }}
          >
            {`<0>BuiltinPageLink</0>: Built-in page <2>{{to}}</2> does not exist.`}
          </Trans>
        </InlineError>
      )
    }

    return (
      <InternalLink to={to} ref={ref} {...other}>
        {Children.count(children) ? children : t(page.title)}
      </InternalLink>
    )
  }
)

interface BuiltinPageLinkProps extends Omit<LinkProps, 'to'> {
  to: BuiltinPageRouteName
}

export default BuiltinPageLink
