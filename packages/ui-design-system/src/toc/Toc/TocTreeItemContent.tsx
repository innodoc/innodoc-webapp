import type { UseTreeItemContentSlotOwnProps } from '@mui/x-tree-view/useTreeItem'
import { SectionLinkFromPath } from '#links'

interface TocTreeItemContentProps extends UseTreeItemContentSlotOwnProps {
  sectionPath: string
}

function TocTreeItemContent({ sectionPath, ref: _ref, ...other }: TocTreeItemContentProps) {
  return <SectionLinkFromPath {...other} sectionPath={sectionPath} />
}

export default TocTreeItemContent
