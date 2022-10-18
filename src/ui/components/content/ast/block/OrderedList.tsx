import { styled } from '@mui/material'

import ContentTree from '@/ui/components/content/ast/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/ast/types'

const StyledOl = styled('ol')(({ theme }) => ({
  paddingLeft: theme.spacing(4),
}))

function OrderedList({ content }: ContentComponentProps<'OrderedList'>) {
  const listItems = content[1].map((item, i) => (
    <li key={i.toString()}>
      <ContentTree content={item} />
    </li>
  ))
  return <StyledOl>{listItems}</StyledOl>
}

export default OrderedList
