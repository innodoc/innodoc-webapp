import type { Element as HastElement } from 'hast'
import type { JSX, ReactNode } from 'react'

interface WithNode {
  children?: ReactNode
  node: HastElement
}

type HastComponentProps<TagName extends keyof JSX.IntrinsicElements> = WithNode &
  Omit<JSX.IntrinsicElements[TagName], 'children'>

export type { HastComponentProps }
