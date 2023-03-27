import { styled } from '@mui/material'
import MuiGrid from '@mui/material/Unstable_Grid2'
import type { ReactNode } from 'react'

const StyledGrid = styled(MuiGrid)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}))

function Grid({ children }: GridProps) {
  return (
    <StyledGrid container spacing={2}>
      {children}
    </StyledGrid>
  )
}

interface GridProps {
  children: ReactNode
}

export default Grid
