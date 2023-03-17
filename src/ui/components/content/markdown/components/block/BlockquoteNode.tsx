import { styled } from '@mui/material'

import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

const StyledBlockquote = styled('blockquote')(({ theme }) => ({
  borderLeftColor: theme.vars.palette.primary.main,
  borderLeftStyle: 'solid',
  borderLeftWidth: theme.spacing(0.4),
  marginBlockEnd: theme.spacing(2),
  marginBlockStart: theme.spacing(2),
  marginInlineStart: theme.spacing(1),
  marginInlineEnd: theme.spacing(3),
  paddingInlineStart: theme.spacing(2),
}))

function BlockquoteNode({ children }: MarkdownComponentProps<'blockquote'>) {
  return <StyledBlockquote>{children}</StyledBlockquote>
}

export default BlockquoteNode
