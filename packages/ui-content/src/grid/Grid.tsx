import type { ReactNode } from 'react'
import type { HastMdxJsxFlowDivElement } from '@innodoc/content-parser/types'

// TODO: migrate Grid (MUI Grid container)
function Grid({ children, id }: GridProps) {
  return <div id={id}>{children}</div>
}

interface GridProps {
  children: ReactNode
  id?: string
  nodeProps: HastMdxJsxFlowDivElement['properties']
}

export default Grid
