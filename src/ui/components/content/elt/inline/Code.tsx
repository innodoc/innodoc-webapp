import { styled } from '@mui/material'

import type { ContentComponentProps } from '@/ui/components/content/elt/types'

const StyledCode = styled('code')(({ theme }) => ({
  backgroundColor: theme.vars.palette.CodeText.bg,
  borderColor: theme.vars.palette.CodeText.border,
  borderRadius: theme.shape.borderRadius,
  borderStyle: 'solid',
  borderWidth: '1px',
  color: theme.vars.palette.CodeText.color,
  fontFamily: theme.typography.code.fontFamily,
  margin: theme.typography.code.margin,
  padding: theme.typography.code.padding,
}))

function Code({ content: [, content] }: ContentComponentProps<'Code'>) {
  return <StyledCode>{content}</StyledCode>
}

export default Code
