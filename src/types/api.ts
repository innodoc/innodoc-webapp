import type { IconProps } from '@/ui/components/common/Icon'

import type { Locale, LocalizedString, PageLinkLocation } from './common'

/** Object with localized titles */
interface LocalizedTitles {
  /** Short localized version of the title for places with limited space */
  shortTitle?: LocalizedString

  /** Localized title */
  title: LocalizedString
}

/** Object with titles as `string` value */
interface Titles {
  /** Short version of the title for places with limited space */
  shortTitle?: string

  /** Title */
  title: string
}

/** Course manifest as returned by content server */
export interface ApiManifest extends LocalizedTitles {
  /** Course description */
  description?: LocalizedString

  /** Course languages */
  languages: ReadonlyArray<Locale>

  /** Course home link */
  homeLink: string

  /** Course logo URL or identifier */
  logo?: string

  /** Custom course pages */
  pages?: ReadonlyArray<ApiPage>

  /** Minimal score a user has to achieve for a test to be passed */
  minScore?: number

  /** Custom MathJax library options */
  mathjax?: MathJaxOptions

  /** Content tree of sections */
  toc?: ReadonlyArray<ApiSection>

  /** Index terms */
  indexTerms: {
    [language: Locale]: {
      [termId: string]: [string, ReadonlyArray<IndexTermOccurance>]
    }
  }

  /** Content boxes per sections */
  boxes: {
    [sectionPath: string]: ReadonlyArray<Box>
  }
}

/** Transformed course manifest as saved in store */
export interface TransformedManifest extends ApiManifest {
  toc?: ReadonlyArray<TransformedSection>
}

/** Manifest as consumed by components */
export interface Manifest
  extends Omit<TransformedManifest, 'description' | 'shortTitle' | 'title'>,
    Titles {
  description?: string
}

/** Base page object */
interface BasePage {
  /** Unique page identifier */
  id: string

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
