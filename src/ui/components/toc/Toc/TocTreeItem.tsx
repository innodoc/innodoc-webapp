import { TreeItem, type TreeItemProps } from '@mui/lab'

import useSelectSectionChildren from '#store/hooks/useSelectSectionChildren'
import type { TranslatedSection } from '#types/entities/section'

import TocTreeItemContent from './TocTreeItemContent'

function TocTreeItem({ section, nodeId }: TocTreeItemProps) {
  const { sections } = useSelectSectionChildren(section.id)

  const children = sections.map((s) => <TocTreeItem key={s.id} nodeId={s.path} section={s} />)

  return (
    <TreeItem
      ContentComponent={TocTreeItemContent}
      // Currently there's no way to augment: https://github.com/mui/material-ui/issues/28668
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      ContentProps={{ section } as any}
      nodeId={nodeId}
    >
      {children}
    </TreeItem>
  )
}

declare module '@mui/lab/TreeItem' {
  interface TreeItemContentProps {
    section: TranslatedSection
  }
}

type TocTreeItemProps = TreeItemProps & {
  section: TranslatedSection
}

export default TocTreeItem
