import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { type BuiltinPagesKey, BUILTIN_PAGES } from '#constants'

import InternalLink, { type InternalLinkProps } from './InternalLink'

const BuiltinPageLink = forwardRef<HTMLAnchorElement, BuiltinPageLinkProps>(
  function BuiltinPageLink({ children, to, ...other }, ref) {
    const { t } = useTranslation()
    const { path, title: titleI18nKey } = BUILTIN_PAGES[to]

    return (
      <InternalLink to={path} ref={ref} {...other}>
        {children || t(titleI18nKey)}
      </InternalLink>
    )
  }
)

export type BuiltinPageLinkProps = Omit<InternalLinkProps, 'to'> & {
  to: BuiltinPagesKey
}

export default BuiltinPageLink
