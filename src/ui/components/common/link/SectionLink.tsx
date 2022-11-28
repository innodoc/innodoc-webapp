import { forwardRef } from 'react'

import useSelectSection from '#store/hooks/useSelectSection'
import type { ApiSection, TranslatedSection } from '#types/entities/section'
import InlineError from '#ui/components/common/error/InlineError'
import { formatSectionTitle, getSectionUrl } from '#utils/content'

import InternalLink, { type InternalLinkProps } from './InternalLink'

/** SectionLinkSection takes `section` */
const SectionLinkSection = forwardRef<HTMLAnchorElement, SectionLinkSectionProps>(
  function SectionLinkSection({ children, preferShortTitle = false, section, ...other }, ref) {
    if (section === undefined) return null

    return (
      <InternalLink to={getSectionUrl(section.path)} ref={ref} {...other}>
        {children || <>{formatSectionTitle(section, preferShortTitle)}</>}
      </InternalLink>
    )
  }
)

interface SectionLinkSectionProps extends Omit<SectionLinkProps, 'section' | 'sectionPath'> {
  section: TranslatedSection
}

/** SectionLinkSectionPath takes `sectionPath` */
const SectionLinkSectionPath = forwardRef<HTMLAnchorElement, SectionLinkSectionPathProps>(
  function SectionLinkSectionPath({ sectionPath: sectionPathFull, ...other }, ref) {
    const [sectionPath, hash] = sectionPathFull.split('#')
    const { section } = useSelectSection(sectionPath)

    if (section === undefined) {
      return (
        <InlineError>SectionLink: Section path &quot;{sectionPath}&quot; not found</InlineError>
      )
    }

    return <SectionLinkSection hash={hash} ref={ref} section={section} {...other} />
  }
)

interface SectionLinkSectionPathProps extends Omit<SectionLinkProps, 'section' | 'sectionPath'> {
  sectionPath: ApiSection['path']
}

/** SectionLink takes either `section` or `sectionPath` */
const SectionLink = forwardRef<HTMLAnchorElement, SectionLinkProps>(function SectionLink(
  { section, sectionPath, ...other },
  ref
) {
  if (section !== undefined && sectionPath !== undefined) {
    return (
      <InlineError>
        SectionLink: Needs either &quot;section&quot; or &quot;sectionPath&quot; prop, not both!
      </InlineError>
    )
  }

  if (section !== undefined) {
    return <SectionLinkSection ref={ref} section={section} {...other} />
  }

  if (sectionPath !== undefined) {
    return <SectionLinkSectionPath ref={ref} sectionPath={sectionPath} {...other} />
  }

  return (
    <InlineError>
      SectionLink: Needs either &quot;section&quot; or &quot;sectionPath&quot; prop!
    </InlineError>
  )
})

interface SectionLinkProps extends Omit<InternalLinkProps, 'to'> {
  preferShortTitle?: boolean
  section?: TranslatedSection
  sectionPath?: ApiSection['path']
}

export default SectionLink
