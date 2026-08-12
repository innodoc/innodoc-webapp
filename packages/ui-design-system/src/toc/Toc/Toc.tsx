import type { MouseEvent } from 'react'
import { RichTreeView } from '@mui/x-tree-view'
import { memo } from 'react'
import { useLocation } from 'wouter'
import type { SectionWithChildren } from '@innodoc/shared-core/types'
import { useRoutes, useSelectSectionTree } from '@innodoc/ui-shared/store-hooks'
import { formatSectionTitle } from '#utils'
import TocTreeItem from './TocTreeItem.js'
import useManageExpanded from './use-manage-expanded.js'

function Toc() {
  const routes = useRoutes()
  const { url } = routes
  const [, navigate] = useLocation()
  const sections = useSelectSectionTree(null)
  const { expandedItems, onItemExpansionToggle, selectedItems } = useManageExpanded()

  const onItemClick = (ev: MouseEvent, sectionPath: string) => {
    navigate(url({ name: 'app:course:section', sectionPath }))
  }

  return (
    <RichTreeView<SectionWithChildren, boolean>
      data-testid="sidebar-toc"
      disableSelection
      expandedItems={expandedItems}
      expansionTrigger="iconContainer"
      getItemId={(item) => item.path}
      getItemLabel={(item) => formatSectionTitle(item, true)}
      items={sections}
      onItemClick={onItemClick}
      onItemExpansionToggle={onItemExpansionToggle}
      selectedItems={selectedItems}
      slots={{ item: TocTreeItem }}
      sx={{ width: '100%' }}
    />
  )
}

export default memo(Toc) // render ~180ms->5ms on opening/closing drawer
