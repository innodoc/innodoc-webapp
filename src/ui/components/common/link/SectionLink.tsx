import { forwardRef } from 'react'

import type { Section } from '@/types/api'
import { formatSectionNumber, sectionUrl } from '@/utils/content'

import InternalLink, { type InternalLinkProps } from './InternalLink'

const SectionLink = forwardRef<HTMLAnchorElement, SectionLinkProps>(function SectionLink(
  { children, preferShortTitle = false, section, ...other },
  ref
) {
  const title =
    preferShortTitle && section.shortTitle !== undefined ? section.shortTitle : section.title

  return (
    <InternalLink to={sectionUrl([...section.parents, section.id].join('/'))} ref={ref} {...other}>
      {children || (
        <>
          {formatSectionNumber(section)} {title}
        </>
      )}
    </InternalLink>
  )
})

type SectionLinkProps = Omit<InternalLinkProps, 'to'> & {
  preferShortTitle?: boolean
  section: Section
}

export default SectionLink
