import { Paper, styled } from '@mui/material'
import clsx from 'clsx'

import type { ContentComponentProps } from '#ui/components/content/ast/types'

const StyledPre = styled('pre')(({ theme }) => ({
  borderLeftWidth: theme.spacing(0.5),
  margin: 0,
  overflow: 'auto',
  padding: theme.spacing(1, 2),
  '& > code': { whiteSpace: 'pre' },
}))

function CodeBlock({ content: [[id, codeTypes], content] }: ContentComponentProps<'CodeBlock'>) {
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
        <code className={clsx(codeTypes.map((codeType) => `code-${codeType}`))} id={id}>
          {content}
        </code>
      </StyledPre>
    </Paper>
  )
}

export default CodeBlock
