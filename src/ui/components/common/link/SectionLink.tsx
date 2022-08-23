import { forwardRef } from 'react'

import type { Section } from '@/types/api'
import { sectionUrl } from '@/utils/url'

import InternalLink, { type InternalLinkProps } from './InternalLink'

const SectionLink = forwardRef<HTMLAnchorElement, SectionLinkProps>(function SectionLink(
  { preferShortTitle = false, section, ...other },
  ref
) {
  // Prefix content with section number
  const numberString = section.number.map((num) => `${num + 1}.`).join('')

  const title =
    preferShortTitle && section.shortTitle !== undefined ? section.shortTitle : section.title

  return (
    <InternalLink to={sectionUrl([...section.parents, section.id].join('/'))} ref={ref} {...other}>
      {numberString} {title}
    </InternalLink>
  )
})

type SectionLinkProps = Omit<InternalLinkProps, 'to'> & {
  preferShortTitle?: boolean
  section: Section
}

export default SectionLink
