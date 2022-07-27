import type { Key, ReactElement } from 'react'

export interface Page {
  icon?: ReactElement
  id: Key
  title: string
  to: string
}
