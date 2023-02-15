import { Paper, styled } from '@mui/material'
import type { Code } from 'mdast'

const StyledPre = styled('pre')(({ theme }) => ({
  borderLeftWidth: theme.spacing(0.5),
  margin: 0,
  overflow: 'auto',
  padding: theme.spacing(1, 2),
  '& > code': { whiteSpace: 'pre' },
}))

function CodeNode({ node }: CodeNodeProps) {
  // TODO: syntax highlighting

  return (
    <Paper
      elevation={1}
      sx={(theme) => ({
        backgroundColor: theme.vars.palette.TransparentPaper.bg,
        color: theme.vars.palette.Code.color,
        my: 2,
      })}
    >
      <StyledPre>
        <code>{node.value}</code>
      </StyledPre>
    </Paper>
  )
}

interface CodeNodeProps {
  node: Code
}

export default CodeNode
