import { TreeItem, useTreeItem, type TreeItemContentProps, type TreeItemProps } from '@mui/lab'
import { Box, Link, styled, Typography } from '@mui/material'
import clsx from 'clsx'
import { forwardRef, type Ref } from 'react'

import type { Section } from '@/types/api'
import SectionLink from '@/ui/components/common/link/SectionLink'
import { formatSectionNumber } from '@/utils/content'

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
  textDecorationColor: theme.palette.text.primary,
})) as typeof Link

const SectionTreeItemContent = forwardRef<unknown, SectionTreeItemContentProps>(
  function SectionTreeItemContent(
    { classes, className, displayIcon, expansionIcon, icon: iconProp, nodeId, section },
    ref
  ) {
    const { expanded, disabled, focused, selected } = useTreeItem(nodeId)

    const icon = iconProp || expansionIcon || displayIcon

    return (
      <StyledLink
        className={clsx(className, classes.root, {
          [classes.expanded]: expanded,
          [classes.selected]: selected,
          [classes.focused]: focused,
          [classes.disabled]: disabled,
        })}
        component={SectionLink}
        ref={ref as Ref<HTMLAnchorElement>}
        section={section}
      >
        <Box sx={{ width: (theme) => theme.spacing(section.parents.length * 2) }} />
        <div className={classes.iconContainer}>{icon}</div>
        <Typography>
          {formatSectionNumber(section)} {section.title}
        </Typography>
      </StyledLink>
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
      // Currently there's no way to augment: https://github.com/mui/material-ui/issues/28668
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      ContentProps={{ section } as any}
      // sx={{ display: 'inline-flex', flexDirection: 'row' }}
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
