import { TableCell } from '@mui/material'

import type { HastComponentProps } from '#components/content/hast'

function TdNode({ children, style }: HastComponentProps<'td'>) {
  return (
    <TableCell sx={style} variant="body">
      {children}
    </TableCell>
  )
}

export default TdNode
