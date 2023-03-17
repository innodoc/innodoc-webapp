import type { Element as HastElement } from 'hast'
import type { ReactNode } from 'react'

interface WithNode {
  children?: ReactNode
  node: HastElement
}

export type MarkdownComponentProps<TagName extends keyof JSX.IntrinsicElements> = WithNode &
  Omit<JSX.IntrinsicElements[TagName], 'children'>
