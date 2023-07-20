import MuiGrid from '@mui/material/Unstable_Grid2'
import type { ReactNode } from 'react'

function Grid({ children }: GridProps) {
  return (
    <MuiGrid container spacing={1}>
      {children}
    </MuiGrid>
  )
}

interface GridProps {
  children: ReactNode
}

export default Grid
