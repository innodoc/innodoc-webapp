import { type TreeItemContentProps, useTreeItem } from '@mui/lab'
import { Box, IconButton, styled, Typography } from '@mui/material'
import clsx from 'clsx'
import { forwardRef, type SyntheticEvent, type ForwardedRef } from 'react'
import { useTranslation } from 'react-i18next'

import type { TranslatedSection } from '#types/entities/section'
import SectionLink from '#ui/components/common/link/SectionLink'
import { formatSectionTitle } from '#utils/content'

const StyledLink = styled(SectionLink)(({ theme }) => ({
  color: theme.vars.palette.text.primary,
  textDecoration: 'none',
  '&:focus': {
    outline: 'none',
    backgroundColor: theme.vars.palette.action.focus,
  },
}))

const TocTreeItemContent = forwardRef(function TocTreeItemContent(
  {
    classes,
    className,
    displayIcon,
    expansionIcon,
    icon: iconProp,
    nodeId,
    section,
  }: TocTreeItemContentProps,
  ref
) {
  const { t } = useTranslation()
  const { expanded, handleExpansion, disabled, focused, selected } = useTreeItem(nodeId)
  const iconNode = iconProp || expansionIcon || displayIcon

  // Allow node toggle without triggering navigation
  const onNodeToggle = (ev: SyntheticEvent) => {
    ev.stopPropagation()
    ev.preventDefault()
    handleExpansion(ev)
  }

  const iconAriaLabel = t(`toc.${expanded ? 'collapseSection' : 'expandSection'}`)

  const icon =
    iconNode !== undefined ? (
      <IconButton aria-label={iconAriaLabel} onClick={onNodeToggle}>
        {iconNode}
      </IconButton>
    ) : null

  return (
    <StyledLink
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      ref={ref as ForwardedRef<HTMLAnchorElement>}
      section={section}
    >
      <Box sx={{ width: (theme) => theme.spacing(section.order.length * 1) }} />
      <Box className={classes.iconContainer} sx={{ mr: 2 }}>
        {icon}
      </Box>
      <Typography component="div">{formatSectionTitle(section, true)}</Typography>
    </StyledLink>
  )
})

interface TocTreeItemContentProps extends TreeItemContentProps {
  section: TranslatedSection
}

export default TocTreeItemContent
