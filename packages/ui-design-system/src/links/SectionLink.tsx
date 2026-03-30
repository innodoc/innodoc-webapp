import { Trans } from 'react-i18next'

import { useRouteManager, useSelectSection } from '@innodoc/ui-store/hooks'
import type { ApiSection, TranslatedSection } from '@innodoc/shared-core/types'

import { InlineError } from '#errors'
import { Code } from '#misc'
import { formatSectionTitle } from '#utils'

import BaseLink from './BaseLink.js'
import type { LinkProps as LinkProperties } from './types.js'

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
  const { url } = useRouteManager()

  return (
    <BaseLink to={url({ name: 'app:course:section', sectionPath: section.path })} ref={reference} {...other}>
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
