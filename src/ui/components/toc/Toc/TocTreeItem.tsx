import { TreeItem, type TreeItemProps } from '@mui/lab'
import { styled } from '@mui/material'

import type { TranslatedSection } from '#types/entities/section'
import useSelectSectionChildren from '#ui/hooks/useSelectSectionChildren'

import TocTreeItemContent from './TocTreeItemContent'

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  '& .MuiTreeItem-iconContainer': {
    marginRight: theme.spacing(1) + ' !important',
  },
}))

function TocTreeItem({ section, nodeId }: TocTreeItemProps) {
  const { sections } = useSelectSectionChildren(section.id)

  const children = sections.map((s) => <TocTreeItem key={s.id} nodeId={s.path} section={s} />)

  return (
    <StyledTreeItem
      ContentComponent={TocTreeItemContent}
      // Currently there's no way to augment: https://github.com/mui/material-ui/issues/28668
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      ContentProps={{ section } as any}
      nodeId={nodeId}
    >
      {children}
    </StyledTreeItem>
  )
}

declare module '@mui/lab/TreeItem' {
  interface TreeItemContentProps {
    section: TranslatedSection
  }
}

interface TocTreeItemProps extends TreeItemProps {
  section: TranslatedSection
}

export default TocTreeItem
