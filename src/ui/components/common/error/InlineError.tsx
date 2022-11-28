import { styled } from '@mui/material'
import type { ReactNode } from 'react'

const StyledSpan = styled('span')(({ theme }) => ({
  color: theme.vars.palette.error.main,
}))

function InlineError({ children }: InlineErrorProps) {
  return <StyledSpan>{children}</StyledSpan>
}

interface InlineErrorProps {
  children: ReactNode
}

export default InlineError
