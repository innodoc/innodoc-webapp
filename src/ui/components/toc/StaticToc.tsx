import { Link, styled } from '@mui/material'

import { selectToc } from '@/store/selectors/content/section'
import type { SectionWithChildren } from '@/types/api'
import SectionLink from '@/ui/components/common/link/SectionLink'
import { useSelector } from '@/ui/hooks/store'

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
  return (
    <li>
      <Link component={SectionLink} section={section} />
      {section.children !== undefined ? (
        <StyledUl>
          {section.children.map((child) => (
            <SectionItem key={child.id} section={child} />
          ))}
        </StyledUl>
      ) : null}
    </li>
  )
}

type SectionProps = {
  section: SectionWithChildren
}

function StaticToc() {
  const toc = useSelector(selectToc)
  return toc !== undefined ? (
    <StyledUlRoot>
      {toc.map((section) => (
        <SectionItem key={section.id} section={section} />
      ))}
    </StyledUlRoot>
  ) : null
}

export default StaticToc
