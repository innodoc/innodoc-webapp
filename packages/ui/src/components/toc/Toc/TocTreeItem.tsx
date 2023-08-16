import { TreeItem, type TreeItemProps } from '@mui/lab'
import { styled } from '@mui/material'
import type { TranslatedSection } from '@innodoc/types/entities'

import { useSelectSectionChildren } from '#hooks/store'

import TocTreeItemContent from './TocTreeItemContent'

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  '& .MuiTreeItem-iconContainer': {
    marginRight: theme.spacing(1) + ' !important',
  },
}))

const CustomTreeItem = (props: CustomTreeItemProps) => (
  <StyledTreeItem ContentComponent={TocTreeItemContent} {...props} />
)

type CustomTreeItemProps = TreeItemProps & { ContentProps: { section: TranslatedSection } }

function TocTreeItem({ section, nodeId }: TocTreeItemProps) {
  const { sections } = useSelectSectionChildren(section.id)

  const children = sections.map((s) => <TocTreeItem key={s.id} nodeId={s.path} section={s} />)

  return (
    <CustomTreeItem ContentProps={{ section }} nodeId={nodeId}>
      {children}
    </CustomTreeItem>
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
