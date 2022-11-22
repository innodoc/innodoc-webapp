import { styled } from '@mui/material'

import ContentTree from '#ui/components/content/ast/ContentTree'
import type { ContentComponentProps } from '#ui/components/content/ast/types'

const StyledUl = styled('ul')(({ theme }) => ({
  paddingLeft: theme.spacing(4),
}))

function BulletList({ content }: ContentComponentProps<'BulletList'>) {
  const listItems = content.map((item, i) => (
    <li key={i.toString()}>
      <ContentTree content={item} />
    </li>
  ))
  return <StyledUl>{listItems}</StyledUl>
}

export default BulletList
