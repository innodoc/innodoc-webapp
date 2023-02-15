import { Children, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { type BuiltinPagesKey, BUILTIN_PAGES } from '#constants'

import InternalLink from './InternalLink'
import type { LinkProps } from './types'

const BuiltinPageLink = forwardRef<HTMLAnchorElement, BuiltinPageLinkProps>(
  function BuiltinPageLink({ children, to, ...other }, ref) {
    const { t } = useTranslation()
    const { path, title: titleI18nKey } = BUILTIN_PAGES[to]

    return (
      <InternalLink to={path} ref={ref} {...other}>
        {Children.count(children) ? children : t(titleI18nKey)}
      </InternalLink>
    )
  }
)

export interface BuiltinPageLinkProps extends Omit<LinkProps, 'to'> {
  to: BuiltinPagesKey
}

export default BuiltinPageLink
