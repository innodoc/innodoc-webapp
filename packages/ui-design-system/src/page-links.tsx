import type { ReactElement } from 'react'
import type { FrontendRouteName, PageLinkLocation } from '@innodoc/shared-core/types'
import { Icon } from '#misc'

/** Page link definition */
interface PageLinkDefinition {
  /** URL path */
  routeName: FrontendRouteName

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

/**
 * Page links to render in a layout slot.
 *
 * Visibility depends on the current route, not on the link definition:
 *
 * - Course links (`app:course:*`) require a `courseSlug`. Outside a course route the URL cannot be
 *   generated at all, so the link is not rendered.
 * - The built-in index link only applies outside a course, where it does not compete with the
 *   course home link.
 *
 * @param location Layout slot of the link list
 * @param hasCourse Whether the current route belongs to a course
 * @returns Visible page link definitions
 */
function selectPageLinks(location: PageLinkLocation, hasCourse: boolean): PageLinkDefinition[] {
  return pageLinks.filter((page) => {
    if (!page.linked?.includes(location)) {
      return false
    }

    return page.routeName.startsWith('app:course:') ? hasCourse : !hasCourse
  })
}

export { selectPageLinks }
export default pageLinks
