import { styled } from '@mui/material'

import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

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
