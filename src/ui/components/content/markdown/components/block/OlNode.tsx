import { styled } from '@mui/material'

import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

const StyledUl = styled('ol')(({ theme }) => ({ paddingLeft: theme.spacing(4) }))

function OlNode({ children }: MarkdownComponentProps<'ol'>) {
  return <StyledUl>{children}</StyledUl>
}

export default OlNode
