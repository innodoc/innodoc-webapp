import type { LanguageCode } from 'iso-639-1'

import type { ApiSection } from '#types/entities/section'

import makeContent, { type Content } from './makeContent'
import { getDates, getTitlesPath, range } from './utils'

type Section = [ApiSection, Content]

type Sections = Record<number, Section>

type SectionDef = number | null | SectionDef[]

let id = 0

const makeSection = (
  idx: number,
  parent: ApiSection | null,
  parentPath: string[],
  courseId: number,
  locales: LanguageCode[]
): Section => {
  const section: ApiSection = {
    id: id++,
    courseId,
    parentId: parent?.id ?? null,
    type: 'regular',
    order: [...(parent?.order ?? []), idx],
    ...getTitlesPath(locales, parentPath),
    ...getDates(),
  }
  return [section, makeContent(locales)]
}

const mapSectionDef = (
  childrenDef: SectionDef,
  idx: number,
  parent: ApiSection | null,
  parentPath: string[],
  courseId: number,
  locales: LanguageCode[]
): Sections => {
  const section = makeSection(idx, parent, parentPath, courseId, locales)
  if (childrenDef === null) return { [section[0].id]: section }

  const childrenDefArr = Array.isArray(childrenDef)
    ? childrenDef
    : range(childrenDef).map(() => null)

  const children = childrenDefArr.reduce<Sections>(
    (acc, def, idx) => ({
      ...acc,
      ...mapSectionDef(def, idx, section[0], section[0].path.split('/'), courseId, locales),
    }),
    {}
  )

  return { [section[0].id]: section, ...children }
}

const sectionDef: SectionDef[] = [
  null, // no children
  4, // children w/o children
  [null, 1, 2, 2, 3], // children that have children
  [3, 2, 2, 4],
  [2, 3, 2],
  2,
  null,
]

const makeSections = (courseId: number, locales: LanguageCode[]) =>
  sectionDef.reduce<Sections>(
    (acc, def, idx) => ({ ...acc, ...mapSectionDef(def, idx, null, [], courseId, locales) }),
    {}
  )

export default makeSections
