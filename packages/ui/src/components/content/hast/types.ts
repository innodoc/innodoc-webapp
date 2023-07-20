import type { Element as HastElement } from 'hast'
import type { ReactNode } from 'react'

interface WithNode {
  children?: ReactNode
  node: HastElement
}

export type HastComponentProps<TagName extends keyof JSX.IntrinsicElements> = WithNode &
  Omit<JSX.IntrinsicElements[TagName], 'children'>
