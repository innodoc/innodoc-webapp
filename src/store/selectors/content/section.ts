import { createSelector } from '@reduxjs/toolkit'

import { selectManifest } from '@/store/slices/contentApi'
import type { Section, TransformedSection } from '@/types/api'

import { selectTranslateFn, type TranslateFn } from './i18n'

/** Translate a section */
function translateSection(t: TranslateFn, section: TransformedSection): Section {
  return {
    ...section,
    shortTitle: t(section.shortTitle),
    title: t(section.title) || '',
    children: section?.children?.map((child) => translateSection(t, child)),
  }
}

/** Select section tree structure with fields translated */
export const selectToc = createSelector([selectManifest, selectTranslateFn], (manifest, t) =>
  manifest?.toc?.map((section) => translateSection(t, section))
)
