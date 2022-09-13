import * as toolkitRaw from '@reduxjs/toolkit'

import { selectUrlWithoutLocale } from '@/store/selectors/ui'
import { selectManifest } from '@/store/slices/contentApi'
import type { SectionWithChildren, SectionWithoutChildren, TransformedSection } from '@/types/api'

import { selectTranslateFn, type TranslateFn } from './i18n'

const { createSelector } = ((toolkitRaw as any).default ?? toolkitRaw) as typeof toolkitRaw

/** Translate a section */
function translateSection(t: TranslateFn, section: TransformedSection): SectionWithChildren {
  return {
    ...section,
    shortTitle: t(section.shortTitle),
    title: t(section.title) || '',
    children: section?.children?.map((child) => translateSection(t, child)),
  }
}

/** Transform `SectionWithChildren` to `SectionWithoutChildren` */
function removeChildren(section: SectionWithChildren): SectionWithoutChildren {
  return {
    id: section.id,
    title: section.title,
    shortTitle: section.shortTitle,
    number: section.number,
    parents: section.parents,
    childrenCount: section?.children?.length || 0,
  }
}

/** Select section tree structure with fields translated */
export const selectToc = createSelector([selectManifest, selectTranslateFn], (manifest, t) =>
  manifest?.toc?.map((section) => translateSection(t, section))
)

/** Select current section path */
export const selectSectionPath = createSelector([selectUrlWithoutLocale], (urlWithoutLocale) =>
  urlWithoutLocale?.startsWith(`/${import.meta.env.INNODOC_SECTION_PATH_PREFIX}/`)
    ? urlWithoutLocale.substring(import.meta.env.INNODOC_SECTION_PATH_PREFIX.length + 2)
    : undefined
)

/** Select section by path */
export const selectSectionByPath = createSelector(
  [selectToc, (_, sectionPath: string | undefined) => sectionPath],
  (toc, sectionPath): SectionWithoutChildren | undefined => {
    if (sectionPath === undefined) return undefined
    const parts = sectionPath.split('/')
    if (toc === undefined) return undefined
    let sections: SectionWithChildren[] | undefined = toc
    let section: SectionWithChildren | undefined = undefined
    while (parts.length > 0) {
      if (section !== undefined) sections = section.children
      const part = parts.shift()
      section = sections?.find((s) => s.id === part)
    }
    return section === undefined ? undefined : removeChildren(section)
  }
)

/**
 * Return an array for the Breadcrumb component. E.g.:
 * ```
 * [
 *  { id: 'foo', title: 'Foo' },
 *  { id: 'foo/bar', title: 'Bar' },
 *  { id: 'foo/bar/baz', title: 'Baz' },
 * ]
 * ```
 */
export const selectBreadcrumbSections = createSelector(
  [selectToc, selectSectionPath],
  (toc, currentSectionPath) => {
    if (toc === undefined || currentSectionPath === undefined) return []
    let sections: SectionWithChildren[] | undefined = toc
    return currentSectionPath.split('/').reduce((acc, id) => {
      if (sections === undefined) return acc
      const section = sections.find((s) => s.id === id)
      sections = section?.children
      if (section === undefined) return acc
      return [...acc, removeChildren(section)]
    }, [] as SectionWithoutChildren[])
  }
)
