import { Table, TableContainer } from '@mui/material'

import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

function TableNode({ children }: MarkdownComponentProps<'table'>) {
  return (
    <TableContainer>
      <Table size="small">{children}</Table>
    </TableContainer>
  )
}

export default TableNode
