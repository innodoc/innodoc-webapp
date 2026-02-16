import { styled } from '@mui/material'
import type { CreateStyledComponent } from '@emotion/styled'
import type { MUIStyledCommonProps } from '@mui/system'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

import type { Theme } from '#theme'

type CreateStyled = CreateStyledComponent<
  MUIStyledCommonProps<Theme>,
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
>

const Code: ReturnType<CreateStyled> = styled('code')(({ theme }) => ({
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
