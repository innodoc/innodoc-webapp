import { styled } from '@mui/material'
import { memo } from 'react'
import type { SectionWithChildren } from '@innodoc/shared-core/types'
import { useSelectSectionTree } from '@innodoc/ui-shared/store-hooks'
import { SectionLink } from '#links'

const StyledUl = styled('ul')(({ theme }) => ({
  listStyleType: 'none',
  paddingBottom: theme.spacing(0.5),
  paddingInlineStart: theme.spacing(3),
}))

const StyledUlRoot = styled('ul')(({ theme }) => ({
  listStyleType: 'none',
  margin: theme.spacing(2, 0),
  paddingInlineStart: 0,
}))

interface SectionProps {
  section: SectionWithChildren
}

/**
 * One node of the table of contents, plus its subtree.
 *
 * Purely presentational: the children come from `section.children`, never from a hook of its own.
 * Mounting `useSelectSectionChildren` per node meant one RTK Query subscription per rendered
 * section (N+1 for a course of N sections), each filtering the whole section array.
 * `StaticToc` subscribes once and hands the assembled tree down.
 *
 * `memo` can only pay off with stable props, and it now has them: the tree selector is module
 * scoped, so an unchanged (data, locale) yields the very same node objects.
 */
const SectionItem = memo(function SectionItem({ section }: SectionProps) {
  // The tree drops `children` on leaves (see `cleanEmptyChildren`), so a leaf is `undefined`, not `[]`
  const children = section.children?.length ? (
    <StyledUl>
      {section.children.map((child) => (
        <SectionItem key={child.path} section={child} />
      ))}
    </StyledUl>
  ) : null

  return (
    <li>
      <SectionLink section={section} />
      {children}
    </li>
  )
})

/** Static, non-collapsible table of contents of the current course. */
function StaticToc() {
  // One subscription for the whole list: `selectSectionTree` returns the nested nodes this
  // component renders, so no child needs to look anything up in the store.
  const sections = useSelectSectionTree(null)

  const children = sections.map((section) => <SectionItem key={section.path} section={section} />)
  return sections.length > 0 ? <StyledUlRoot>{children}</StyledUlRoot> : null
}

export default StaticToc
