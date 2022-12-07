import { forwardRef } from 'react'
import { Trans } from 'react-i18next'

import useSelectSection from '#store/hooks/useSelectSection'
import type { ApiSection, TranslatedSection } from '#types/entities/section'
import InlineError from '#ui/components/common/error/InlineError'
import { formatSectionTitle } from '#utils/content'
import { getSectionUrl } from '#utils/url'

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
        <InlineError>
          <Trans
            i18nKey="error.sectionLinkSectionPathProp"
            components={{ 0: <code />, 2: <code /> }}
            values={{ sectionPath }}
          >
            {`<0>SectionLink</0>: Section path <2>{{sectionPath}}</2> not found.`}
          </Trans>
        </InlineError>
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
    throw new Error('Use either section or sectionPath prop, not both.')
  }

  if (section !== undefined) {
    return <SectionLinkSection ref={ref} section={section} {...other} />
  }

  if (sectionPath !== undefined) {
    return <SectionLinkSectionPath ref={ref} sectionPath={sectionPath} {...other} />
  }

  throw new Error('Use either section or sectionPath prop.')
})

interface SectionLinkProps extends Omit<InternalLinkProps, 'to'> {
  preferShortTitle?: boolean
  section?: TranslatedSection
  sectionPath?: ApiSection['path']
}

export default SectionLink
