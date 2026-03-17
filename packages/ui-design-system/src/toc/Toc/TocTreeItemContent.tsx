// import { Box, IconButton, styled, Typography } from '@mui/material'
// import { type TreeItemContentProps, useTreeItem } from '@mui/x-tree-view'
// import clsx from 'clsx'
// import { type ForwardedRef, forwardRef, type MouseEvent } from 'react'
// import { useTranslation } from 'react-i18next'

// import type { TranslatedSection } from '@innodoc/shared-core/types'

// import { SectionLink } from '#links'
// import { formatSectionTitle } from '#utils'

// const StyledLink = styled(SectionLink)(({ theme }) => ({
//   color: theme.vars.palette.text.primary,
//   textDecoration: 'none',
//   '&:focus': {
//     outline: 'none',
//     backgroundColor: theme.vars.palette.action.focus,
//   },
// }))

// const TocTreeItemContent = forwardRef(function TocTreeItemContent(
//   { classes, className, displayIcon, expansionIcon, icon: iconProperty, nodeId, section }: TocTreeItemContentProperties,
//   reference,
// ) {
//   const { t } = useTranslation()
//   const { expanded, handleExpansion, disabled, focused, selected } = useTreeItem(nodeId)
//   const iconNode = iconProperty ?? expansionIcon ?? displayIcon

//   // Allow node toggle without triggering navigation
//   const onNodeToggle = (event: MouseEvent<HTMLDivElement>) => {
//     event.stopPropagation()
//     event.preventDefault()
//     handleExpansion(event)
//   }

//   const iconAriaLabel = t(`toc.${expanded ? 'collapseSection' : 'expandSection'}`)

//   const icon = iconNode === undefined ? null : <IconButton aria-label={iconAriaLabel}>{iconNode}</IconButton>

//   return (
//     <StyledLink
//       className={clsx(className, classes.root, {
//         [classes.expanded]: expanded,
//         [classes.selected]: selected,
//         [classes.focused]: focused,
//         [classes.disabled]: disabled,
//       })}
//       ref={reference as ForwardedRef<HTMLAnchorElement>}
//       section={section}
//     >
//       <Box sx={{ width: (theme) => theme.spacing(section.order.length * 1) }} />
//       <Box className={classes.iconContainer} sx={{ mr: 2 }} onClick={onNodeToggle}>
//         {icon}
//       </Box>
//       <Typography component="div">{formatSectionTitle(section, true)}</Typography>
//     </StyledLink>
//   )
// })

// interface TocTreeItemContentProperties extends TreeItemContentProps {
//   section: TranslatedSection
// }

// export default TocTreeItemContent
