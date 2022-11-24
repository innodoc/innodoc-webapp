import type { CamelCasedProperties } from 'type-fest'

import type { DbCourse, DbLocalizedTitles, DbPage, DbSection } from '#server/database/types'

type Translated<T> = Omit<T, 'shortTitle' | 'title'> & Titles

/** Object with localized titles */
export type LocalizedTitles = CamelCasedProperties<DbLocalizedTitles>

/** Object with titles as `string` value */
interface Titles {
  /** Short version of the title for places with limited space */
  shortTitle?: string

  /** Title */
  title: string
}

/** Course as returned by content server */
export type ApiCourse = CamelCasedProperties<DbCourse>
// /** Content tree of sections */
// toc?: ReadonlyArray<ApiSection>

// /** Index terms */
// indexTerms: {
//   [locale in LanguageCode]: {
//     [termId: string]: [string, ReadonlyArray<IndexTermOccurance>]
//   }
// }

// /** Content boxes per sections */
// boxes: {
//   [sectionPath: string]: ReadonlyArray<Box>
// }

/** Transformed course as saved in store */
// export interface TransformedCourse extends ApiCourse {
//   toc?: ReadonlyArray<TransformedSection>
// }

/** Course as consumed by components */
export interface Course
  extends Omit<TransformedCourse, 'description' | 'shortTitle' | 'title'>,
    Titles {
  description?: string
}

/** Page object as returned by content server */
export type ApiPage = CamelCasedProperties<DbPage>

/** Page object as consumed by components */
export type Page = Translated<ApiPage>

/** Section object as returned by content server */
export type ApiSection = CamelCasedProperties<DbSection>

/** Page object as consumed by components */
export type Section = Translated<ApiSection>

/** Section object as consumed by components */
// export interface SectionWithChildren
//   extends Omit<TransformedSection, 'shortTitle' | 'title' | 'children'>,
//     Titles {
//   /** Sections sub-sections */
//   children?: SectionWithChildren[]
// }

/** Section object as consumed by components (w/o children subtree) */
// export interface SectionWithoutChildren extends Omit<SectionWithChildren, 'children'> {
//   /** Sub-section count */
//   childrenCount: number
// }

// export type Section = SectionWithChildren | SectionWithoutChildren

// TODO Remove
/** MathJax library options */
export interface MathJaxOptions {
  loader: {
    load: string[]
    paths: string[]
  }
  tex: {
    packages: Record<string, string[]>
  }
}

/** Occurence of an index term within content */
type IndexTermOccurance = [string, string]

/** A content box */
type Box = string[]
