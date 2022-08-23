import { TreeItem, useTreeItem, type TreeItemContentProps, type TreeItemProps } from '@mui/lab'
import { Link } from '@mui/material'
import clsx from 'clsx'
import { forwardRef, type LegacyRef } from 'react'

import type { Section } from '@/types/api'
import SectionLink from '@/ui/components/common/link/SectionLink'

const SectionTreeItemContent = forwardRef<unknown, SectionTreeItemContentProps>(
  function SectionTreeItem({ classes, className, nodeId, section }, ref) {
    const { expanded } = useTreeItem(nodeId)

    return (
      <div
        className={clsx(className, classes.root, {
          [classes.expanded]: expanded,
        })}
        ref={ref as LegacyRef<HTMLDivElement>}
      >
        <Link component={SectionLink} section={section} />
      </div>
    )
  }
)

type SectionTreeItemContentProps = TreeItemContentProps & {
  section: Section
}

function TocTreeItem({ section, ...other }: TocTreeItemProps) {
  return (
    <TreeItem
      ContentComponent={SectionTreeItemContent}
      // Currently there's no way to augment: https://stackoverflow.com/a/69483286/15194429
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      ContentProps={{ section } as any}
      {...other}
    />
  )
}

type TocTreeItemProps = TreeItemProps & {
  section: Section
}

declare module '@mui/lab/TreeItem' {
  interface TreeItemContentProps {
    section: Section
  }
}

export default TocTreeItem
