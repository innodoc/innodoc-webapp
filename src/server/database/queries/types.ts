import type { Root } from 'mdast'

export type ContentResultFromValue = { value: Root } | undefined
export type ContentResult = Root | undefined
export type IdResult = { id: number } | undefined
