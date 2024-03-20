import type { HastMdxJsxFlowDivElement } from '@innodoc/markdown/types'

/** Custom component properties */
type NodeProps<P extends readonly string[]> = HastMdxJsxFlowDivElement['properties'] &
  Partial<Record<P[number], string>>

export type { NodeProps }
