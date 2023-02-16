import { styled } from '@mui/material'
import type { List } from 'mdast'

import ListItemNode from './ListItemNode'

const StyledUl = styled('ul')(({ theme }) => ({ paddingLeft: theme.spacing(4) }))
const StyledOl = styled('ol')(({ theme }) => ({ paddingLeft: theme.spacing(4) }))

function ListNode({ node }: ListNodeProps) {
  const ListComponent = node.ordered ? StyledOl : StyledUl

  const listItems = node.children.map((child, idx) => (
    <ListItemNode key={child?.data?.id ?? idx.toString()} node={child} />
  ))

  return <ListComponent>{listItems}</ListComponent>
}

interface ListNodeProps {
  node: List
}

export default ListNode
