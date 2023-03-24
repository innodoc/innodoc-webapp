import { Paper, styled } from '@mui/material'

import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

const StyledPre = styled('pre')(({ theme }) => ({
  borderLeftWidth: theme.spacing(0.5),
  margin: 0,
  overflow: 'auto',
  padding: theme.spacing(1, 2),
  '& > code': {
    backgroundColor: 'transparent',
    border: 'none',
    margin: 0,
    padding: 0,
    whiteSpace: 'pre',
  },
}))

function PreNode({ children }: MarkdownComponentProps<'pre'>) {
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
      <StyledPre>{children}</StyledPre>
    </Paper>
  )
}

export default PreNode
