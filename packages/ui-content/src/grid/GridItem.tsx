import type { ReactNode } from 'react'
import type { HastMdxJsxFlowDivElement } from '@innodoc/content-parser/types'

// TODO: migrate GridItem (MUI Grid item with size/offset nodeProps)
function GridItem({ children, id }: GridItemProps) {
  return <div id={id}>{children}</div>
}

interface GridItemProps {
  children: ReactNode
  id?: string
  nodeProps: HastMdxJsxFlowDivElement['properties']
}

export default GridItem
