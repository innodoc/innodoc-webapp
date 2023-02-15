import type { Link } from '@mui/material'
import type { ComponentProps } from 'react'

import { type BuiltinPagesKey, BUILTIN_PAGES_KEYS } from '#constants'

import type { BuiltinPageLinkProps } from './BuiltinPageLink'

/** General link props */
export interface LinkProps extends Omit<ComponentProps<typeof Link>, 'href'> {
  /** Optional hash */
  hash?: string

  /** Target path */
  to: string
}

/** Check if `to` is link to built-in page */
export function isBuiltinPageLinkProps(props: LinkProps): props is BuiltinPageLinkProps {
  return BUILTIN_PAGES_KEYS.includes(props.to as BuiltinPagesKey)
}
