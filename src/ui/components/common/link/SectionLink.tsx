import { forwardRef } from 'react'

import type { RootState } from '#store/makeStore'
import { selectSectionByPath } from '#store/selectors/content/section'
import type { Section } from '#types/api'
import InlineError from '#ui/components/common/error/InlineError'
import { useSelector } from '#ui/hooks/store'
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

type SectionLinkSectionProps = Omit<SectionLinkProps, 'section' | 'sectionPath'> & {
  section: Section
}

/** SectionLinkSectionPath takes `sectionPath` */
const SectionLinkSectionPath = forwardRef<HTMLAnchorElement, SectionLinkSectionPathProps>(
  function SectionLinkSectionPath({ sectionPath: sectionPathFull, ...other }, ref) {
    const [sectionPath, hash] = sectionPathFull.split('#')
    const selectSection = (state: RootState) => selectSectionByPath(state, sectionPath)
    const section = useSelector(selectSection)
    if (section === undefined) {
      return (
        <InlineError>SectionLink: Section path &quot;{sectionPath}&quot; not found!</InlineError>
      )
    }

    return <SectionLinkSection hash={hash} ref={ref} section={section} {...other} />
  }
)

type SectionLinkSectionPathProps = Omit<SectionLinkProps, 'section' | 'sectionPath'> & {
  sectionPath: string
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

type SectionLinkProps = Omit<InternalLinkProps, 'to'> & {
  preferShortTitle?: boolean
  section?: Section
  sectionPath?: string
}

export default SectionLink
