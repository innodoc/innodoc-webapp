import { styled, TableRow } from '@mui/material'

import type { HastComponentProps } from '#components/content/hast'

const StyledTableRow = styled(TableRow)({
  '&:last-child td': { border: 0 },
})

function TrNode({ children }: HastComponentProps<'tr'>) {
  return <StyledTableRow>{children}</StyledTableRow>
}

export default TrNode
