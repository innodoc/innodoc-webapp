import { Children, forwardRef } from 'react'
import { Trans } from 'react-i18next'

import { useRouteManager, useSelectSection } from '@innodoc/hooks'
import type { ApiSection, TranslatedSection } from '@innodoc/schema/types'

import { InlineError } from '#common/errors'
import { Code } from '#common/misc'
import { formatSectionTitle } from '#utils'

import BaseLink from './BaseLink.js'
import type { LinkProps as LinkProperties } from './types.js'

/** Link to a section using `sectionPath` */
const SectionLinkFromPath = forwardRef<HTMLAnchorElement, SectionLinkFromPathProperties>(function SectionLinkFromPath(
  { sectionPath, ...other },
  reference,
) {
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
})

interface SectionLinkFromPathProperties extends Omit<SectionLinkProperties, 'section'> {
  sectionPath: ApiSection['path']
}

/** Link to a section */
const SectionLink = forwardRef<HTMLAnchorElement, SectionLinkProperties>(function SectionLink(
  { children, preferShortTitle = false, section, ...other },
  reference,
) {
  const { url } = useRouteManager()

  return (
    <BaseLink to={url({ name: 'app:course:section', sectionPath: section.path })} ref={reference} {...other}>
      {Children.count(children) ? children : <>{formatSectionTitle(section, preferShortTitle)}</>}
    </BaseLink>
  )
})

interface SectionLinkProperties extends Omit<LinkProperties, 'to'> {
  preferShortTitle?: boolean
  section: TranslatedSection
}

export { SectionLinkFromPath }
export default SectionLink
