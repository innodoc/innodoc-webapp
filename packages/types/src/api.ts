import { Locale, PageLinkLocation } from './common'

export interface Manifest {
  title: string
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

export interface Page {
  /** Unique page identifier */
  id: string

  /** Icon string */
  icon?: string

  /** Where the page should be linked */
  linked?: PageLinkLocation[]

  /** Short version of the page title for places with limited space */
  shortTitle?: string

  /** Page title */
  title: string
}

export interface Section {
  /** Section identifier, unique within siblings */
  id: string

  /** Section title */
  title: string

  /** Sections sub-sections */
  children: Section[]
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
