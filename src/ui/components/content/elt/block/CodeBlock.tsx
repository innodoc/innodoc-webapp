import { styled } from '@mui/material'
import clsx from 'clsx'

import type { ContentComponentProps } from '@/ui/components/content/elt/types'

const StyledPre = styled('pre')(({ theme }) => ({
  background: theme.vars.palette.CodeText.bg,
  borderLeftColor: theme.vars.palette.CodeText.border,
  borderLeftStyle: 'solid',
  borderLeftWidth: theme.spacing(0.5),
  color: theme.vars.palette.CodeText.color,
  paddingLeft: theme.spacing(1),
  '& > code': { whiteSpace: 'pre' },
}))

function CodeBlock({ content: [[id, codeTypes], content] }: ContentComponentProps<'CodeBlock'>) {
  return (
    <StyledPre>
      <code className={clsx(codeTypes.map((codeType) => `code-${codeType}`))} id={id}>
        {content}
      </code>
    </StyledPre>
  )
}

export default CodeBlock
