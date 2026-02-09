import { styled } from '@mui/material'
import { TreeView } from '@mui/x-tree-view'
import { memo } from 'react'

import { useSelectSectionChildren } from '@innodoc/hooks'

import { Icon } from '#misc'

import TocTreeItem from './TocTreeItem.js'
import useManageExpanded from './useManageExpanded.js'

const StyledTreeView = styled(TreeView)(({ theme }) => ({
  width: '100%',
  '& .MuiTreeItem-group': {
    marginInlineStart: 0,
  },
  '& .MuiTreeItem-content': {
    padding: theme.spacing(1, 2),
  },
}))

function Toc() {
  const { sections } = useSelectSectionChildren(null)
  const { expanded, onNodeToggle, selected } = useManageExpanded()

  const children = sections.map((s) => <TocTreeItem key={s.id} nodeId={s.path} section={s} />)

  return (
    <StyledTreeView
      data-testid="sidebar-toc"
      defaultCollapseIcon={<Icon name="mdi:chevron-down" />}
      defaultExpandIcon={<Icon name="mdi:chevron-right" />}
      disableSelection
      expanded={expanded}
      onNodeToggle={onNodeToggle}
      selected={selected}
    >
      {children}
    </StyledTreeView>
  )
}

export default memo(Toc) // render ~180ms->5ms on opening/closing drawer
