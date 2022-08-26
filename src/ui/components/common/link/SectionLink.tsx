import { forwardRef } from 'react'

import type { RootState } from '@/store/makeStore'
import { selectSectionByPath } from '@/store/selectors/content/section'
import type { Section } from '@/types/api'
import { useSelector } from '@/ui/hooks/store'
import { getSectionPath, formatSectionTitle, sectionUrl } from '@/utils/content'

import InternalLink, { type InternalLinkProps } from './InternalLink'

const SectionLinkSection = forwardRef<HTMLAnchorElement, Omit<SectionLinkProps, 'sectionPath'>>(
  function SectionLinkSection({ children, preferShortTitle = false, section, ...other }, ref) {
    if (section === undefined) return null

    return (
      <InternalLink to={sectionUrl(getSectionPath(section))} ref={ref} {...other}>
        {children || <>{formatSectionTitle(section, preferShortTitle)}</>}
      </InternalLink>
    )
  }
)

const SectionLinkSectionPath = forwardRef<HTMLAnchorElement, Omit<SectionLinkProps, 'section'>>(
  function SectionLinkSectionPath({ sectionPath, ...other }, ref) {
    const selectSection = (state: RootState) => selectSectionByPath(state, sectionPath)
    const section = useSelector(selectSection)
    return <SectionLinkSection ref={ref} section={section} {...other} />
  }
)

const SectionLink = forwardRef<HTMLAnchorElement, SectionLinkProps>(function SectionLink(
  { section, sectionPath, ...other },
  ref
) {
  if (section !== undefined && sectionPath !== undefined) {
    throw new Error('<SectionLink> needs either section or sectionPath prop, not both.')
  }

  if (section !== undefined) {
    return <SectionLinkSection ref={ref} section={section} {...other} />
  }

  if (sectionPath !== undefined) {
    return <SectionLinkSectionPath ref={ref} sectionPath={sectionPath} {...other} />
  }

  throw new Error('<SectionLink> needs either section or sectionPath prop.')
})

type SectionLinkProps = Omit<InternalLinkProps, 'to'> & {
  preferShortTitle?: boolean
  section?: Section
  sectionPath?: string
}

export default SectionLink
