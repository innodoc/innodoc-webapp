import type { ReactElement } from 'react'
import { PAGE_LINK_LOCACTIONS } from '@innodoc/shared-core/constants'
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

/** Whether a page link belongs to `location` and matches the course context */
function isPageLinkVisible(page: PageLinkDefinition, location: PageLinkLocation, hasCourse: boolean): boolean {
  if (!page.linked?.includes(location)) {
    return false
  }

  return page.routeName.startsWith('app:course:') ? hasCourse : !hasCourse
}

/**
 * The (location × hasCourse) filter results, precomputed once: the list is static and tiny, so
 * reference stability per argument comes for free, with no cache machinery.
 */
const hasCourseKey = (hasCourse: boolean): 'true' | 'false' => (hasCourse ? 'true' : 'false')

const PAGE_LINKS_BY_SLOT = Object.fromEntries(
  PAGE_LINK_LOCACTIONS.flatMap((location) =>
    [true, false].map((hasCourse): [`${PageLinkLocation}:${'true' | 'false'}`, PageLinkDefinition[]] => [
      `${location}:${hasCourseKey(hasCourse)}`,
      pageLinks.filter((page) => isPageLinkVisible(page, location, hasCourse)),
    ]),
  ),
) as Record<`${PageLinkLocation}:${boolean}`, PageLinkDefinition[]>

/**
 * Page links to render in a layout slot.
 *
 * Not a store selector: a pure lookup over the static {@link pageLinks} list, returning one of
 * the four precomputed module constants, so the same arguments always yield the same reference.
 * Do not wrap it in `createSelector` or `useMemo` - the list is static and tiny, and stable
 * references are already free.
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
  return PAGE_LINKS_BY_SLOT[`${location}:${hasCourseKey(hasCourse)}`]
}

export { selectPageLinks }
export default pageLinks
