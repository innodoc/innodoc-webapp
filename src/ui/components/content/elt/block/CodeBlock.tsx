import { styled } from '@mui/material'
import clsx from 'clsx'

import type { ContentComponentProps } from '@/ui/components/content/elt/types'

const StyledPre = styled('pre')(({ theme }) => ({
  background: 'rgba(0, 0, 0, 0.06)', // TODO new color for transparent?
  color: theme.palette.grey[300],
  borderLeftStyle: 'solid',
  borderLeftWidth: theme.spacing(0.5),
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
