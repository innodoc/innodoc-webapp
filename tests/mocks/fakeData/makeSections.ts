import type { LanguageCode } from 'iso-639-1'

import type { ApiSection } from '#types/entities/section'

import makeContent from './makeContent'
import type { Section, SectionDef } from './types'
import { getDates, getTitlesPath, range, seed } from './utils'

let id = 0

const makeSection = (
  idx: number,
  parent: ApiSection | null,
  parentPath: string[],
  courseId: number,
  locales: LanguageCode[]
): Section => {
  seed(`section-${courseId}-${id}`)
  const section: ApiSection = {
    id: id++,
    courseId,
    parentId: parent?.id ?? null,
    type: 'regular',
    order: [...(parent?.order ?? []), idx],
    ...getTitlesPath(locales, parentPath),
    ...getDates(),
  }
  return { data: section, content: makeContent(locales) }
}

const mapSectionDef = (
  childrenDef: SectionDef,
  idx: number,
  parent: ApiSection | null,
  parentPath: string[],
  courseId: number,
  locales: LanguageCode[]
): Section[] => {
  const section = makeSection(idx, parent, parentPath, courseId, locales)
  if (childrenDef === null) {
    return [section]
  }

  const childrenDefArr = Array.isArray(childrenDef)
    ? childrenDef
    : range(childrenDef).map(() => null)

  const children = childrenDefArr.reduce(
    (acc, def, idx) => [
      ...acc,
      ...mapSectionDef(def, idx, section.data, section.data.path.split('/'), courseId, locales),
    ],
    [] as Section[]
  )

  return [section, ...children]
}

const sectionDef: SectionDef[] = [
  null, // no children
  4, // children w/o children
  [null, [2, [2, 3, 4]], [2, 1], [[4, 2, 3], [1, 2], 3], 3], // children that have children
  [3, 2, 4],
  [2, 3],
  2,
  null,
]

const makeSections = (courseId: number, locales: LanguageCode[]) =>
  sectionDef.reduce(
    (acc, def, idx) => [...acc, ...mapSectionDef(def, idx, null, [], courseId, locales)],
    [] as Section[]
  )

export default makeSections
