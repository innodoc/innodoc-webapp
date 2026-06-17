import type { MUIStyledCommonProps } from '@mui/system'
import type { ComponentType, HTMLAttributes } from 'react'
import { styled } from '@mui/material'

// Use explicit type annotation to avoid "not portable" (TS2883)
const Code = styled('code')(({ theme }) => ({
  backgroundColor: theme.vars.palette.Code.bg,
  borderColor: theme.vars.palette.Code.border,
  borderRadius: theme.shape.borderRadius,
  borderStyle: 'solid',
  borderWidth: '1px',
  color: theme.vars.palette.Code.color,
  fontFamily: theme.typography.code.fontFamily,
  padding: theme.typography.code.padding,
})) as ComponentType<HTMLAttributes<HTMLElement> & MUIStyledCommonProps>

export default Code
