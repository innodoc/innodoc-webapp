import type { TreeItemProps } from '@mui/x-tree-view'
import type { Ref } from 'react'
import { TreeItem } from '@mui/x-tree-view'
import TocTreeItemContent from './TocTreeItemContent'

interface TocTreeItemProps extends TreeItemProps {
  ref?: Ref<HTMLLIElement>
}

function TocTreeItem(props: TocTreeItemProps) {
  const { itemId } = props

  return <TreeItem {...props} slots={{ content: TocTreeItemContent }} slotProps={{ content: { itemID: itemId } }} />
}

export default TocTreeItem
