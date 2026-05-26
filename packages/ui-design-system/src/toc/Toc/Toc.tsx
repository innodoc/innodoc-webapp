import { styled } from '@mui/material'
import { RichTreeView } from '@mui/x-tree-view'
import { memo } from 'react'
import { useSelectSectionTree } from '@innodoc/ui-store/hooks'
import { Icon } from '#misc'
import TocTreeItem from './TocTreeItem.js'
import useManageExpanded from './use-manage-expanded.js'

const StyledTreeView = styled(RichTreeView)(({ theme }) => ({
  width: '100%',
  '& .MuiTreeItem-group': {
    marginInlineStart: 0,
  },
  '& .MuiTreeItem-content': {
    padding: theme.spacing(1, 2),
  },
}))

function CollapseIcon() {
  return <Icon name="mdi:chevron-down" />
}

function ExpandIcon() {
  return <Icon name="mdi:chevron-right" />
}

function Toc() {
  const sections = useSelectSectionTree(null)
  const { expandedItems, onItemExpansionToggle, selectedItems } = useManageExpanded()

  // const children = sections.map((s) => <TocTreeItem key={s.id} itemId={s.path} section={s} />)

  return (
    <StyledTreeView
      data-testid="sidebar-toc"
      slots={{
        collapseIcon: CollapseIcon,
        expandIcon: ExpandIcon,
        item: TocTreeItem,
      }}
      items={sections}
      disableSelection
      expandedItems={expandedItems}
      onItemExpansionToggle={onItemExpansionToggle}
      selectedItems={selectedItems}
    />
  )
}

export default memo(Toc) // render ~180ms->5ms on opening/closing drawer
