import { RichTreeView } from '@mui/x-tree-view'
import { memo } from 'react'
import type { TranslatedSection } from '@innodoc/shared-core/types'
import { useSelectSectionTree } from '@innodoc/ui-shared/store-hooks'
import { Icon } from '#misc'
import { formatSectionTitle } from '#utils'
import TocTreeItem from './TocTreeItem.js'
import useManageExpanded from './use-manage-expanded.js'

interface TocSection extends TranslatedSection {
  children?: TocSection[]
}

function CollapseIcon() {
  return <Icon name="mdi:chevron-down" />
}

function ExpandIcon() {
  return <Icon name="mdi:chevron-right" />
}

function Toc() {
  const sections = useSelectSectionTree(null)
  const { expandedItems, onItemExpansionToggle, selectedItems } = useManageExpanded()

  return (
    <RichTreeView<TocSection, boolean>
      data-testid="sidebar-toc"
      slots={{
        collapseIcon: CollapseIcon,
        expandIcon: ExpandIcon,
        item: TocTreeItem,
      }}
      items={sections}
      getItemId={(item) => item.path}
      getItemLabel={(item) => formatSectionTitle(item, true)}
      getItemChildren={(item) => item.children}
      disableSelection
      expandedItems={expandedItems}
      onItemExpansionToggle={onItemExpansionToggle}
      selectedItems={selectedItems}
      sx={(theme) => ({
        width: '100%',
        '& .MuiTreeItem-group': {
          marginInlineStart: 0,
        },
        '& .MuiTreeItem-content': {
          padding: theme.spacing(1, 2),
        },
      })}
    />
  )
}

export default memo(Toc) // render ~180ms->5ms on opening/closing drawer
