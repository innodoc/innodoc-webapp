import { styled, TableRow } from '@mui/material'

import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

const StyledTableRow = styled(TableRow)({
  '&:last-child td': { border: 0 },
})

function TrNode({ children }: MarkdownComponentProps<'tr'>) {
  return <StyledTableRow>{children}</StyledTableRow>
}

export default TrNode
