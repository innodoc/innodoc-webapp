import { TreeView } from '@mui/lab'
import { styled } from '@mui/material'

import useSelectSectionChildren from '#store/hooks/useSelectSectionChildren'
import Icon from '#ui/components/common/Icon'

import TocTreeItem from './TocTreeItem'
import useManageExpanded from './useManageExpanded'

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
    <>
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
    </>
  )
}

export default Toc
