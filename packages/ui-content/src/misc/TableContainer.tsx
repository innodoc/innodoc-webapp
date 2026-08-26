import type { ReactNode } from 'react'
import type { HastMdxJsxFlowDivElement } from '@innodoc/content-parser/types'

// TODO: migrate TableContainer (MUI Paper container with scroll)
function TableContainer({ children, id }: TableContainerProps) {
  return <div id={id}>{children}</div>
}

interface TableContainerProps {
  children: ReactNode
  id?: string
  nodeProps: HastMdxJsxFlowDivElement['properties']
}

export default TableContainer
