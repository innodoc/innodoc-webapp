import type { CamelCasedProperties } from 'type-fest'

import type { DbCourse, DbLocalizedTitles } from '#server/database/types'
import type { IconProps } from '#ui/components/common/Icon'

import type { PageLinkLocation } from './common'

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

/** Base page object */
interface BasePage {
  /** Unique page identifier */
  name: string

  /** Icon string */
  icon?: IconProps['name']

  /** Where the page should be linked */
  linked?: PageLinkLocation[]
}

/** Page object as returned by content server */
export interface ApiPage extends BasePage, LocalizedTitles {}

/** Page object as consumed by components */
export interface Page extends BasePage, Titles {}

/** Section object as returned by content server */
export interface ApiSection extends LocalizedTitles {
  /** Section identifier, unique within siblings */
  id: string

  /** Sections sub-sections */
  children?: ApiSection[]
}

/** Transformed section object as saved in the store */
export interface TransformedSection extends ApiSection {
  /** Section ID of parents, e.g. `['section-foo', 'section-bar']` */
  parents: string[]

  /** Section section number */
  number: number[]

  /** Sections sub-sections */
  children?: TransformedSection[]
}

/** Section object as consumed by components */
export interface SectionWithChildren
  extends Omit<TransformedSection, 'shortTitle' | 'title' | 'children'>,
    Titles {
  /** Sections sub-sections */
  children?: SectionWithChildren[]
}

/** Section object as consumed by components (w/o children subtree) */
export interface SectionWithoutChildren extends Omit<SectionWithChildren, 'children'> {
  /** Sub-section count */
  childrenCount: number
}

export type Section = SectionWithChildren | SectionWithoutChildren

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
