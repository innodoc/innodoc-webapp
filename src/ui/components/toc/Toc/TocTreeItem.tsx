import { TreeItem, useTreeItem, type TreeItemContentProps, type TreeItemProps } from '@mui/lab'
import { Box, IconButton, Link, styled, Typography } from '@mui/material'
import clsx from 'clsx'
import { forwardRef, type MouseEvent, type Ref } from 'react'
import { useTranslation } from 'react-i18next'

import type { SectionWithChildren } from '@/types/api'
import SectionLink from '@/ui/components/common/link/SectionLink'
import { formatSectionNumber } from '@/utils/content'

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
  '&:focus': {
    outline: 'none',
    backgroundColor: theme.palette.action.focus,
  },
  '&.Mui-selected': {
    textDecoration: 'underline',
  },
})) as typeof Link

const SectionTreeItemContent = forwardRef<unknown, SectionTreeItemContentProps>(
  function SectionTreeItemContent(
    { classes, className, displayIcon, expansionIcon, icon: iconProp, nodeId, section },
    ref
  ) {
    const { t } = useTranslation()
    const { expanded, handleExpansion, disabled, focused, selected } = useTreeItem(nodeId)
    const icon = iconProp || expansionIcon || displayIcon

    // Allow node toggle without triggering navigation
    const onNodeToggle = (ev: MouseEvent) => {
      ev.stopPropagation()
      ev.preventDefault()
      handleExpansion(ev)
    }

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
        <Box className={classes.iconContainer}>
          {icon !== undefined ? (
            <IconButton
              aria-label={t(`toc.${expanded ? 'collapseSection' : 'expandSection'}`)}
              onClick={onNodeToggle}
            >
              {icon}
            </IconButton>
          ) : null}
        </Box>
        <Typography component="div">
          {formatSectionNumber(section)} {section.title}
        </Typography>
      </StyledLink>
    )
  }
)

type SectionTreeItemContentProps = TreeItemContentProps & {
  section: SectionWithChildren
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
  section: SectionWithChildren
}

declare module '@mui/lab/TreeItem' {
  interface TreeItemContentProps {
    section: SectionWithChildren
  }
}

export default TocTreeItem
