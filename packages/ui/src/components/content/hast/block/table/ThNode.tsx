import { TableCell } from '@mui/material'

import type { HastComponentProps } from '#components/content/hast'

function ThNode({ children, style }: HastComponentProps<'th'>) {
  return (
    <TableCell component="th" sx={style} variant="head">
      {children}
    </TableCell>
  )
}

export default ThNode
