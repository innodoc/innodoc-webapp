import { Locale, LocalizedString, PageLinkLocation } from './common'

export interface Manifest {
  title: LocalizedString
  description?: LocalizedString
  languages: ReadonlyArray<Locale>
  homeLink: string
  logo?: string
  pages?: ReadonlyArray<Page>
  minScore?: number
  mathjax?: MathJaxOptions
  toc?: ReadonlyArray<Section>
  indexTerms: {
    [language: Locale]: {
      [termId: string]: [string, ReadonlyArray<IndexTermOccurance>]
    }
  }
  boxes: {
    [sectionPath: string]: ReadonlyArray<Box>
  }
}

export interface TransformedManifest extends Omit<Manifest, 'toc'> {
  toc?: ReadonlyArray<TransformedSection>
}

export interface Page {
  /** Unique page identifier */
  id: string

  /** Icon string */
  icon?: string

  /** Where the page should be linked */
  linked?: PageLinkLocation[]

  /** Short version of the page title for places with limited space */
  shortTitle?: LocalizedString

  /** Page title */
  title: LocalizedString
}

/** Section object as returned by content server */
export interface Section {
  /** Section identifier, unique within siblings */
  id: string

  /** Short version of the section title for places with limited space */
  shortTitle?: LocalizedString

  /** Section title */
  title: LocalizedString

  /** Sections sub-sections */
  children?: Section[]
}

/** Section object augmented with path and number information */
export interface TransformedSection extends Section {
  /** Section ID of parents, e.g. `['section-foo', 'section-bar']` */
  parents: string[]

  /** Section section number */
  number: number[]

  /** Sections sub-sections */
  children?: TransformedSection[]
}

/** Section object with `LocalizedString` fields replaced */
export interface TranslatedSection
  extends Omit<TransformedSection, 'shortTitle' | 'title' | 'children'> {
  /** Short version of the translated page title for places with limited space */
  shortTitle?: string

  /** Transated section title */
  title: string

  /** Sections sub-sections */
  children?: TranslatedSection[]
}

export interface MathJaxOptions {
  loader: {
    load: string[]
    paths: string[]
  }
  tex: {
    packages: Record<string, string[]>
  }
}

type IndexTermOccurance = [string, string]

type Box = string[]
