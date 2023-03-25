import { TableCell } from '@mui/material'

import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

function ThNode({ children, style }: MarkdownComponentProps<'th'>) {
  return (
    <TableCell component="th" sx={style} variant="head">
      {children}
    </TableCell>
  )
}

export default ThNode
