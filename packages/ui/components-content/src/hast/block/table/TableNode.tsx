import { Table, TableContainer } from '@mui/material'

import type { HastComponentProps } from '#hast'

function TableNode({ children }: HastComponentProps<'table'>) {
  return (
    <TableContainer>
      <Table size="small">{children}</Table>
    </TableContainer>
  )
}

export default TableNode
