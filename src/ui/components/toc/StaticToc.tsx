import { Link, styled } from '@mui/material'

import type { RootState } from '#store/makeStore'
import { selectSectionsByParent } from '#store/selectors/content/section'
import type { Section } from '#types/api'
import SectionLink from '#ui/components/common/link/SectionLink'
import { useSelector } from '#ui/hooks/store'

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

function SectionItem({ section }: SectionProps) {
  const selectSections = (state: RootState) => selectSectionsByParent(state, section.path)
  const sections = useSelector(selectSections)

  const children =
    sections !== undefined ? (
      <StyledUl>
        {sections.map((child) => (
          <SectionItem key={child.id} section={child} />
        ))}
      </StyledUl>
    ) : null

  return (
    <li>
      <Link component={SectionLink} section={section} />
      {children}
    </li>
  )
}

type SectionProps = {
  section: Section
}

function StaticToc() {
  const selectSections = (state: RootState) => selectSectionsByParent(state, null)
  const sections = useSelector(selectSections)

  const children = sections.map((section) => <SectionItem key={section.path} section={section} />)
  return sections !== undefined ? <StyledUlRoot>{children}</StyledUlRoot> : null
}

export default StaticToc
