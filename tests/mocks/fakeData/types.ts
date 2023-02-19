import type { LanguageCode } from 'iso-639-1'
import type { Node } from 'unist'

import type { ApiPage } from '#types/entities/page'
import type { ApiSection } from '#types/entities/section'

export interface BaseOptions {
  seed?: number | string
}

export interface ContentOptions extends BaseOptions {
  headerDepth?: number
  nodeCount: number
}

export type NodeMakers = [
  number, // Probability
  () => Node // Maker function
][]

export type Content = Partial<Record<LanguageCode, string>>

export type Page = [ApiPage, Content]

export type Section = [ApiSection, Content]

export type Sections = Record<number, Section>

export type SectionDef = number | null | SectionDef[]
