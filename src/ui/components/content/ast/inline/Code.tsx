import { styled } from '@mui/material'

import type { ContentComponentProps } from '@/ui/components/content/ast/types'

const StyledCode = styled('code')(({ theme }) => ({
  backgroundColor: theme.vars.palette.Code.bg,
  borderColor: theme.vars.palette.Code.border,
  borderRadius: theme.shape.borderRadius,
  borderStyle: 'solid',
  borderWidth: '1px',
  color: theme.vars.palette.Code.color,
  fontFamily: theme.typography.code.fontFamily,
  margin: theme.typography.code.margin,
  padding: theme.typography.code.padding,
}))

function Code({ content: [, content] }: ContentComponentProps<'Code'>) {
  return <StyledCode>{content}</StyledCode>
}

export default Code
