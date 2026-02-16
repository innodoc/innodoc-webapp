import { styled } from '@mui/material'

import type { HastComponentProps } from '#hast'

const StyledUl = styled('ul')(({ theme }) => ({ paddingLeft: theme.spacing(4) }))

function UlNode({ children }: HastComponentProps<'ul'>) {
  return <StyledUl>{children}</StyledUl>
}

export default UlNode
