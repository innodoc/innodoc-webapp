import { styled } from '@mui/material'

import { useSelectSectionChildren } from '@innodoc/ui-store/hooks'
import type { TranslatedSection } from '@innodoc/shared-core/types'

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

function SectionItem({ section }: SectionProps) {
  const { sections } = useSelectSectionChildren(section.id)

  const children =
    sections.length > 0 ? (
      <StyledUl>
        {sections.map((child) => (
          <SectionItem key={child.id} section={child} />
        ))}
      </StyledUl>
    ) : null

  return (
    <li>
      <SectionLink section={section} />
      {children}
    </li>
  )
}

interface SectionProps {
  section: TranslatedSection
}

function StaticToc() {
  const { sections } = useSelectSectionChildren(null)

  const children = sections.map((section) => <SectionItem key={section.path} section={section} />)
  return sections.length > 0 ? <StyledUlRoot>{children}</StyledUlRoot> : null
}

export default StaticToc
