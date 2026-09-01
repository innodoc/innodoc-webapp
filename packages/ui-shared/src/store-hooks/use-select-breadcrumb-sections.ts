import type { LanguageCode } from 'iso-639-1'
import { createSelector } from '@reduxjs/toolkit'
import { isCourseSectionRouteInfo } from '@innodoc/shared-core/typeguards'
import type { ApiSection, TranslatedSection } from '@innodoc/shared-core/types'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import getSectionsApi from '@innodoc/shared-store/slices/content/sections'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { EMPTY_TRANSLATED_SECTIONS } from './constants.js'
import { useSelector } from './redux.js'
import { translateEntityArray } from './utils.js'

/**
 * Module-scope so one cache is shared across renders. Its arguments are already
 * explicit (`result`, `sectionPath`, `locale`), so nothing closes over render state.
 */
const selectBreadcrumbSections = createSelector(
  [
    (result: { data: ApiSection[] | undefined }) => result.data,
    (result, _sectionPath: string | null) => _sectionPath,
    (result, _sectionPath, locale: LanguageCode) => locale,
  ],
  (sections, _sectionPath, locale): readonly TranslatedSection[] => {
    if (sections === undefined || _sectionPath === null) {
      return EMPTY_TRANSLATED_SECTIONS
    }

    const section = sections.find((s) => s.path === _sectionPath)
    if (section === undefined) {
      return EMPTY_TRANSLATED_SECTIONS
    }

    const parts = section.path.split('/')
    const bcSections: ApiSection[] = []

    for (let idx = 0; idx < parts.length; ++idx) {
      const _path = parts.slice(0, idx + 1).join('/')
      const sec = sections.find((s) => s.path === _path)
      if (sec) {
        bcSections.push(sec)
      }
    }

    return translateEntityArray(bcSections, locale)
  },
)

/**
 * Create section data for the Breadcrumb component. E.g.:
 * ```
 * [
 *  { path: 'foo', ... },
 *  { path: 'foo/bar', ... },
 *  { path: 'foo/bar/baz', ... },
 * ]
 * ```
 *
 * @returns Array of sections
 */
function useSelectBreadcrumbSections(): { sections: readonly TranslatedSection[] } {
  const routeInfo = useSelector(selectRouteInfo)
  const { courseSlug, sectionPath } = isCourseSectionRouteInfo(routeInfo)
    ? routeInfo
    : { courseSlug: undefined, sectionPath: undefined }
  const routeManager = useRouteManager()
  const sections = getSectionsApi(routeManager)

  // oxlint-disable-next-line react/react-compiler -- `sections` is cached via `??=` in `getSectionsApi`, hook ref is stable
  return sections.useGetCourseSectionsQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: (result) => ({ sections: selectBreadcrumbSections(result, sectionPath, routeInfo.locale) }),
      skip: !courseSlug || !sectionPath,
    },
  )
}

export default useSelectBreadcrumbSections
