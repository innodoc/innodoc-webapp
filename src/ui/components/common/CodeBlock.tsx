import { Paper, styled } from '@mui/material'
import type { ReactNode } from 'react'

const StyledPre = styled('pre', { shouldForwardProp: (prop) => prop !== 'wrap' })<StyledPreProps>(
  ({ theme, wrap }) => ({
    borderLeftWidth: theme.spacing(0.5),
    margin: 0,
    overflowX: wrap ? 'hidden' : 'auto',
    overflowY: 'hidden',
    padding: theme.spacing(1, 2),
    textWrap: wrap ? 'wrap' : 'nowrap',
    whiteSpace: wrap ? 'normal' : 'pre',
    '& > code': {
      backgroundColor: 'transparent',
      border: 'none',
      margin: 0,
      padding: 0,
      whiteSpace: wrap ? 'normal' : 'pre',
      textWrap: wrap ? 'wrap' : 'nowrap',
    },
  })
)

interface StyledPreProps {
  wrap: boolean
}

function CodeBlock({ children, wrap = false }: CodeBlockProps) {
  return (
    <Paper
      elevation={1}
      sx={(theme) => ({
        backgroundColor: theme.vars.palette.TransparentPaper.bg,
        color: theme.vars.palette.Code.color,
        my: 2,
      })}
    >
      <StyledPre wrap={wrap}>{children}</StyledPre>
    </Paper>
  )
}

interface CodeBlockProps {
  children: ReactNode
  wrap?: boolean
}

export default CodeBlock
