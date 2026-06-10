import { styled } from '@mui/material'

const Code = styled('code')(({ theme }) => ({
  backgroundColor: theme.vars.palette.Code.bg,
  borderColor: theme.vars.palette.Code.border,
  borderRadius: theme.shape.borderRadius,
  borderStyle: 'solid',
  borderWidth: '1px',
  color: theme.vars.palette.Code.color,
  fontFamily: theme.typography.code.fontFamily,
  padding: theme.typography.code.padding,
}))

export default Code
