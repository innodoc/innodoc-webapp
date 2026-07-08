import type { ComponentProps } from 'react'
import { Chip } from '@mui/material'
import { TreeItemContent, useTreeItemModel } from '@mui/x-tree-view'
import type { SectionWithChildren } from '@innodoc/shared-core/types'
import { Icon } from '#misc'

type TocTreeItemContentProps = ComponentProps<typeof TreeItemContent>

function TestChip() {
  const icon = <Icon fontSize="small" name="mdi:file-document-check" />
  return <Chip icon={icon} label="Test" size="small" />
}

function TocTreeItemContent({ children, ...props }: TocTreeItemContentProps) {
  const item = useTreeItemModel<SectionWithChildren>(props.itemID ?? '')
  const chip = item?.type === 'test' ? <TestChip /> : null

  return (
    <TreeItemContent {...props}>
      {children}
      {chip}
    </TreeItemContent>
  )
}

export default TocTreeItemContent
