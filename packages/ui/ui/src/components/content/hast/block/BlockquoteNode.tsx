import { styled } from '@mui/material'

import type { HastComponentProps } from '#components/content/hast'

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

function BlockquoteNode({ children }: HastComponentProps<'blockquote'>) {
  return <StyledBlockquote>{children}</StyledBlockquote>
}

export default BlockquoteNode
