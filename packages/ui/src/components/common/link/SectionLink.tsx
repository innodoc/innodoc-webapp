import { Children, forwardRef } from 'react'
import { Trans } from 'react-i18next'

import type { ApiSection, TranslatedSection } from '@innodoc/types/entities'
import { formatSectionTitle } from '@innodoc/utils/content'

import { Code, InlineError } from '#components/common'
import useRouteManager from '#hooks/routes'
import { useSelectSection } from '#hooks/store'

import BaseLink from './BaseLink'
import type { LinkProps } from './types'

/** Link to a section using `sectionPath` */
const SectionLinkFromPath = forwardRef<HTMLAnchorElement, SectionLinkFromPathProps>(
  function SectionLinkFromPath({ sectionPath, ...other }, ref) {
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

    return <SectionLink ref={ref} section={section} {...other} />
  }
)

interface SectionLinkFromPathProps extends Omit<SectionLinkProps, 'section'> {
  sectionPath: ApiSection['path']
}

/** Link to a section */
const SectionLink = forwardRef<HTMLAnchorElement, SectionLinkProps>(function SectionLink(
  { children, preferShortTitle = false, section, ...other },
  ref
) {
  const { generateUrl } = useRouteManager()

  if (section === undefined) {
    return null
  }

  return (
    <BaseLink
      to={generateUrl({ routeName: 'app:section', sectionPath: section.path })}
      ref={ref}
      {...other}
    >
      {Children.count(children) ? children : <>{formatSectionTitle(section, preferShortTitle)}</>}
    </BaseLink>
  )
})

interface SectionLinkProps extends Omit<LinkProps, 'to'> {
  preferShortTitle?: boolean
  section: TranslatedSection
}

export { SectionLinkFromPath }
export default SectionLink
