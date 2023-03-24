import { styled } from '@mui/material'

import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

const StyledUl = styled('ul')(({ theme }) => ({ paddingLeft: theme.spacing(4) }))

function UlNode({ children }: MarkdownComponentProps<'ul'>) {
  return <StyledUl>{children}</StyledUl>
}

export default UlNode
