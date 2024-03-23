import type { ReactElement } from 'react'

import type { AppRouteName } from '@innodoc/routes/types/routeNames'
import type { PageLinkLocation } from '@innodoc/types/common'

import { Icon } from '#misc'

/** Page link definition */
interface PageLinkDefinition {
  /** URL path */
  routeName: AppRouteName

  /** Page title i18n key */
  title?: string

  /** Icon name */
  icon: ReactElement

  /** Location in the page layout where a link should appear */
  linked?: PageLinkLocation[]
}

/** Built-in pages */
const builtInPageLinks: PageLinkDefinition[] = [
  {
    icon: <Icon name="mdi:home" />,
    linked: ['footer', 'nav'],
    title: 'pages.builtin.home.title',
    routeName: 'app:index',
  },
] as const

/** Course pages */
const coursePageLinks: PageLinkDefinition[] = [
  {
    icon: <Icon name="mdi:home" />,
    linked: ['footer', 'nav'],
    routeName: 'app:course:index',
  },
  {
    icon: <Icon name="mdi:chart-line" />,
    linked: ['footer', 'nav'],
    title: 'pages.course.progress.title',
    routeName: 'app:course:progress',
  },
  {
    icon: <Icon name="mdi:table-of-contents" />,
    linked: ['footer'],
    title: 'pages.course.toc.title',
    routeName: 'app:course:toc',
  },
  {
    icon: <Icon name="mdi:list-box" />,
    linked: ['footer'],
    title: 'pages.course.glossary.title',
    routeName: 'app:course:glossary',
  },
] as const

const pageLinks = [...builtInPageLinks, ...coursePageLinks] as const

export default pageLinks
