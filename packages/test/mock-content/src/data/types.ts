import type { Faker } from '@faker-js/faker'
import type { LanguageCode } from 'iso-639-1'
import type { RootContent } from 'mdast'

import type { ApiCourse, ApiPage, ApiSection, FragmentTypeSchema } from '@innodoc/schema/types'

interface BaseOptions {
  seed?: number | string
}

type LocalizedContent = Partial<Record<LanguageCode, string>>

interface ContentOptions extends BaseOptions {
  headerDepth?: number
  nodeCount: number
}

type Fakers = Partial<Record<LanguageCode, Faker>>

type NodeFactory = [
  number, // Probability
  () => RootContent, // Factory function
]

interface FakerCourse {
  data: ApiCourse
  fragments: FakerFragments
  pages: FakerPage[]
  sections: FakerSection[]
}

interface FakerPage {
  data: ApiPage
  content: LocalizedContent
}

interface FakerSection {
  data: ApiSection
  content: LocalizedContent
}

type FakerFragments = Partial<Record<FragmentTypeSchema, LocalizedContent>>

type SectionDef = number | null | SectionDef[]

export type {
  BaseOptions,
  ContentOptions,
  FakerCourse,
  FakerFragments,
  FakerPage,
  Fakers,
  FakerSection,
  LocalizedContent,
  NodeFactory,
  SectionDef,
}
