import type { Link } from '@mui/material'
import type { ComponentProps } from 'react'

/** General link props */
export interface LinkProps extends Omit<ComponentProps<typeof Link>, 'href'> {
  /** Optional hash */
  hash?: string

  /** Target (`href` or link specifier) */
  to: string
}
