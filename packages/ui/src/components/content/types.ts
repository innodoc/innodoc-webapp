/** Custom component properties */
type NodeProps<P extends readonly string[]> = Partial<Record<P[number], string>>

export type { NodeProps }
