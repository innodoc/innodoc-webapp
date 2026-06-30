import type { Ref } from 'react'
import { TreeItem, type TreeItemProps, type TreeItemSlotProps } from '@mui/x-tree-view'
import TocTreeItemContent from './TocTreeItemContent.js'

function TocTreeItem({ ref, itemId, ...rest }: TreeItemProps & { ref?: Ref<HTMLLIElement> }) {
  return (
    <TreeItem
      {...rest}
      itemId={itemId}
      ref={ref}
      slots={{ content: TocTreeItemContent }}
      slotProps={{ content: { sectionPath: itemId } as TreeItemSlotProps['content'] }}
    />
  )
}

export default TocTreeItem
