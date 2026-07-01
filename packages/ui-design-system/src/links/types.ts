import type { Link } from '@mui/material'
import type { ComponentProps, Ref } from 'react'

/** General link props */
interface LinkProps extends Omit<ComponentProps<typeof Link>, 'href'> {
  /** Optional hash */
  hash?: string

  /** Target (`href` or link specifier) */
  to: string

  ref?: Ref<HTMLAnchorElement | null>
}

export type { LinkProps }
