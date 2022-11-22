import { styled } from '@mui/material'
import type { ReactNode } from 'react'

const StyledDiv = styled('div')(({ theme }) => ({
  color: theme.vars.palette.error.main,
}))

function BlockError({ children }: BlockErrorProps) {
  return <StyledDiv>{children}</StyledDiv>
}

type BlockErrorProps = {
  children: ReactNode
}

export default BlockError
