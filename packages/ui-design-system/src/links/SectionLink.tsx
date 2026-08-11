import type { LinkProps as LinkProperties } from './types.js'
import { Trans } from 'react-i18next'
import type { ApiSection, TranslatedSection } from '@innodoc/shared-core/types'
import { useRoutes, useSelectSection } from '@innodoc/ui-shared/store-hooks'
import { InlineError } from '#errors'
import { Code } from '#misc'
import { formatSectionTitle } from '#utils'
import BaseLink from './BaseLink.js'

/** Link to a section using `sectionPath` */
function SectionLinkFromPath({ ref: reference, sectionPath, ...other }: SectionLinkFromPathProperties) {
  const { section } = useSelectSection(sectionPath)

  if (section === undefined) {
    return (
      <InlineError>
        <Trans
          i18nKey="error.sectionLinkSectionPathProp"
          components={{ 0: <Code />, 2: <Code /> }}
          values={{ sectionPath }}
        >
          {`<0>SectionLink</0>: <2>{{sectionPath}}</2> not found`}
        </Trans>
      </InlineError>
    )
  }

  return <SectionLink ref={reference} section={section} {...other} />
}

interface SectionLinkFromPathProperties extends Omit<SectionLinkProperties, 'section'> {
  sectionPath: ApiSection['path']
}

/** Link to a section */
function SectionLink({ ref: reference, children, preferShortTitle = false, section, ...other }: SectionLinkProperties) {
  const { url } = useRoutes()

  let href: string
  try {
    href = url({ name: 'app:course:section', sectionPath: section.path })
  } catch (error) {
    console.error('[SectionLink] Failed to generate URL:', {
      error,
      sectionPath: section.path,
      section,
    })
    return (
      <InlineError>
        <Trans
          i18nKey="error.sectionLinkUrlGeneration"
          components={{ 0: <Code /> }}
          values={{ sectionPath: section.path }}
        >
          {`<0>SectionLink</0>: Failed to generate URL for <2>{{sectionPath}}</2>`}
        </Trans>
      </InlineError>
    )
  }

  return (
    <BaseLink to={href} ref={reference} {...other}>
      {children ?? <>{formatSectionTitle(section, preferShortTitle)}</>}
    </BaseLink>
  )
}

interface SectionLinkProperties extends Omit<LinkProperties, 'to'> {
  preferShortTitle?: boolean
  section: TranslatedSection
}

export { SectionLinkFromPath }
export default SectionLink
