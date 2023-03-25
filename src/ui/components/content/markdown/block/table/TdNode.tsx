import { TableCell } from '@mui/material'

import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

function TdNode({ children, style }: MarkdownComponentProps<'td'>) {
  return (
    <TableCell sx={style} variant="body">
      {children}
    </TableCell>
  )
}

export default TdNode
