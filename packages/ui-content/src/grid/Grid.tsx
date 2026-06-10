import type { ReactNode } from 'react'
import MuiGrid from '@mui/material/Grid'

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
